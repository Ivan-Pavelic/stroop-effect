from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import numpy as np
from datetime import datetime
from joblib import load as joblib_load

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:5000').split(','))
MODEL_PATH = os.getenv("MODEL_PATH", "stroop_model.joblib")

try:
    if os.path.exists(MODEL_PATH):
        MODEL = joblib_load(MODEL_PATH)
        print(f"Model loaded successfully from {MODEL_PATH}")
    else:
        print(f"Warning: Model file not found at {MODEL_PATH}. Running without ML model.")
        MODEL = None
except Exception as e:
    print(f"Error loading model: {str(e)}. Running without ML model.")
    MODEL = None
    
FEATURES = ["corr_mean", "rt_mean", "age", "sex", "timeofday"]

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'service': 'Stroop Test AI Service',
        'timestamp': datetime.now().isoformat()
    })

# Analyze cognitive performance
@app.route('/api/analyze', methods=['POST'])
def analyze_performance():
    try:
        if MODEL is None:
            return jsonify({
                'success': False,
                'error': 'Model failed to load.'  
            }), 500
            
        data = request.json
        
        # Extract game data
        corr_mean = data.get('corr_mean', data.get('accuracy', 0))
        rt_mean = data.get('rt_mean', data.get('avgTime', 1000))
        age = data.get('age', 50)
        sex = data.get('sex', 0.5)
        timeofday = data.get('timeofday', data.get('timeOfDay', 12*60))
        
        # accuracy = data.get('accuracy', 0) # corr_mean
        # avg_time = data.get('avgTime', 0) # rt_mean
        round_times = data.get('roundTimes', [])
        answers = data.get('answers', [])
        total_rounds = data.get('totalRounds', 10)
        
        # Perform analysis
        analysis = perform_cognitive_analysis(
            corr_mean,
            rt_mean,
            sex,
            age,
            timeofday,
            round_times,
            answers,
            total_rounds
        )
        
        return jsonify({
            'success': True,
            'analysis': analysis
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Generate adaptive tasks based on performance
@app.route('/api/generate-tasks', methods=['POST'])
def generate_tasks():
    try:
        data = request.json
        
        difficulty = data.get('difficulty', 'medium')
        count = data.get('count', 10)
        user_performance = data.get('userPerformance', None)
        
        # Generate tasks
        tasks = generate_stroop_tasks(
            difficulty=difficulty,
            count=count,
            user_performance=user_performance
        )
        
        return jsonify({
            'success': True,
            'tasks': tasks
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Get cognitive insights over time
@app.route('/api/insights', methods=['POST'])
def get_insights():
    try:
        data = request.json
        
        game_history = data.get('gameHistory', [])
        
        if len(game_history) < 2:
            return jsonify({
                'success': True,
                'insights': {
                    'message': 'Play more games to get personalized insights!',
                    'trend': 'neutral',
                    'recommendations': ['Keep practicing to establish your baseline performance.']
                }
            })
        
        insights = generate_insights(game_history)
        
        return jsonify({
            'success': True,
            'insights': insights
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def perform_cognitive_analysis(corr_mean, rt_mean, sex, age, timeofday, round_times, answers, total_rounds):
    """
    Analyze cognitive performance based on Stroop test results using Machine Learning.
    """
    
    if isinstance(sex, str):
        sex = 1 if sex.lower() in ('male','m') else 0 if sex.lower() in ('female', 'f') else 0.5

    # Use ML model if available, otherwise use heuristic
    if MODEL is not None:
        try:
            x = np.array([[float(corr_mean), float(rt_mean), float(age), float(sex), int(timeofday)]])
            y = int(MODEL.predict(x)[0])
        except Exception as e:
            print(f"Error in model prediction: {str(e)}. Using heuristic fallback.")
            # Fallback: use heuristic based on accuracy and reaction time
            y = 1 if corr_mean < 0.6 or rt_mean > 2500 else 0
    else:
        # Fallback heuristic when model is not available
        # y = 1 means negative condition, y = 0 means good condition
        y = 1 if corr_mean < 0.6 or rt_mean > 2500 else 0
    
    # Calculate consistency (standard deviation of response times)
    if len(round_times) > 1:
        consistency = float(np.std(round_times))
        consistency_score = max(0, 100 - (consistency / 10))  # Lower std = higher score
    else:
        consistency = 0
        consistency_score = 50
    
    # Calculate improvement trend
    if len(round_times) >= 4:
        first_half = np.mean(round_times[:len(round_times)//2])
        second_half = np.mean(round_times[len(round_times)//2:])
        improvement = ((first_half - second_half) / first_half) * 100 if first_half > 0 else 0
    else:
        improvement = 0
    
    # Calculate cognitive score components
    accuracy_score = corr_mean
    speed_score = max(0, min(100, ((3000 - rt_mean) / 2500) * 100))
    
    # Weighted cognitive score
    cognitive_score = int(
        (accuracy_score * 0.5) +
        (speed_score * 0.3) +
        (consistency_score * 0.2)
    )

    cognitive_score = 53.5 if y == 1 else 100
    
    # Determine performance level
    if cognitive_score >= 85:
        level = 'Excellent'
        color = 'green'
    elif cognitive_score >= 70:
        level = 'Good'
        color = 'blue'
    elif cognitive_score >= 50:
        level = 'Average'
        color = 'yellow'
    else:
        level = 'Needs Improvement'
        color = 'orange'
    
    # Generate feedback message
    feedback = generate_feedback(corr_mean, rt_mean, consistency_score, improvement)
    
    # Generate recommendations
    recommendations = generate_recommendations(corr_mean, rt_mean, consistency_score)

    return {
        'y': int(y),  # Explicitly return y value (0 = good, 1 = negative condition)
        'cognitiveScore': cognitive_score,
        'level': level,
        'levelColor': color,
        'components': {
            'accuracy': round(accuracy_score, 1),
            'speed': round(speed_score, 1),
            'consistency': round(consistency_score, 1)
        },
        'improvement': round(improvement, 1),
        'feedback': feedback,
        'recommendations': recommendations
    }


def generate_feedback(accuracy, avg_time, consistency, improvement):
    """
    Generate personalized feedback based on performance.
    """
    feedback_parts = []
    
    # Accuracy feedback
    if accuracy >= 90:
        feedback_parts.append("Excellent accuracy! Your color recognition is very sharp.")
    elif accuracy >= 70:
        feedback_parts.append("Good accuracy. Keep focusing on the ink color, not the word meaning.")
    else:
        feedback_parts.append("Focus on identifying the ink color, not reading the word.")
    
    # Speed feedback
    if avg_time < 1000:
        feedback_parts.append("Impressive speed! You're processing visual information quickly.")
    elif avg_time < 2000:
        feedback_parts.append("Good response time. With practice, you can get even faster.")
    else:
        feedback_parts.append("Try to respond more quickly while maintaining accuracy.")
    
    # Consistency feedback
    if consistency >= 80:
        feedback_parts.append("Your responses are very consistent throughout the test.")
    elif consistency >= 60:
        feedback_parts.append("Fairly consistent performance with some variation.")
    else:
        feedback_parts.append("Your response times varied quite a bit. Try to maintain a steady pace.")
    
    # Improvement feedback
    if improvement > 10:
        feedback_parts.append("Great improvement during the test! You adapted well.")
    elif improvement < -10:
        feedback_parts.append("Your performance decreased slightly toward the end. Consider taking short breaks.")
    
    return " ".join(feedback_parts)


def generate_recommendations(accuracy, avg_time, consistency):
    """
    Generate personalized recommendations for improvement.
    """
    recommendations = []
    
    if accuracy < 80:
        recommendations.append("Practice ignoring the word meaning and focus only on the ink color.")
        recommendations.append("Try saying the color out loud before selecting your answer.")
    
    if avg_time > 1500:
        recommendations.append("Work on quick visual recognition by practicing daily.")
        recommendations.append("Try to respond instinctively rather than overthinking.")
    
    if consistency < 70:
        recommendations.append("Maintain a steady breathing pattern during the test.")
        recommendations.append("Find a consistent rhythm for your responses.")
    
    if not recommendations:
        recommendations.append("Great job! Keep practicing to maintain your sharp cognitive skills.")
        recommendations.append("Try increasing the difficulty level for a greater challenge.")
    
    return recommendations


def generate_stroop_tasks(difficulty, count, user_performance=None):
    """
    Generate Stroop test tasks with adaptive difficulty.
    """
    colors = [
        {'name': 'RED', 'value': '#EF4444'},
        {'name': 'BLUE', 'value': '#3B82F6'},
        {'name': 'GREEN', 'value': '#10B981'},
        {'name': 'YELLOW', 'value': '#EAB308'}
    ]
    
    # Adjust congruent/incongruent ratio based on difficulty
    if difficulty == 'easy':
        congruent_ratio = 0.7  # 70% matching
    elif difficulty == 'hard':
        congruent_ratio = 0.2  # 20% matching
    else:
        congruent_ratio = 0.5  # 50% matching
    
    # Adjust based on user performance if available
    if user_performance:
        if user_performance.get('accuracy', 100) > 85:
            congruent_ratio -= 0.1  # Make it harder
        elif user_performance.get('accuracy', 100) < 60:
            congruent_ratio += 0.1  # Make it easier
    
    tasks = []
    for i in range(count):
        word_color = colors[np.random.randint(0, len(colors))]
        
        if np.random.random() < congruent_ratio:
            # Congruent: word and color match
            display_color = word_color
            is_congruent = True
        else:
            # Incongruent: word and color don't match
            other_colors = [c for c in colors if c['name'] != word_color['name']]
            display_color = other_colors[np.random.randint(0, len(other_colors))]
            is_congruent = False
        
        tasks.append({
            'id': i + 1,
            'text': word_color['name'],
            'displayColor': display_color['value'],
            'correctAnswer': display_color['name'],
            'isCongruent': is_congruent,
            'difficulty': difficulty
        })
    
    return tasks


def generate_insights(game_history):
    """
    Generate insights from game history.
    """
    if not game_history:
        return {
            'message': 'No game history available.',
            'trend': 'neutral',
            'recommendations': []
        }
    
    # Extract scores over time
    scores = [game.get('cognitiveScore', 0) for game in game_history]
    accuracies = [game.get('accuracy', 0) for game in game_history]
    times = [game.get('avgTime', 0) for game in game_history]
    
    # Calculate trends
    if len(scores) >= 3:
        recent_avg = np.mean(scores[-3:])
        older_avg = np.mean(scores[:-3]) if len(scores) > 3 else scores[0]
        
        if recent_avg > older_avg + 5:
            trend = 'improving'
            trend_message = "Your cognitive performance is improving! Keep up the great work."
        elif recent_avg < older_avg - 5:
            trend = 'declining'
            trend_message = "Your recent scores are lower than before. Consider practicing more frequently."
        else:
            trend = 'stable'
            trend_message = "Your performance is consistent. Try challenging yourself with harder difficulty."
    else:
        trend = 'neutral'
        trend_message = "Keep playing to establish your performance trend."
    
    # Generate specific insights
    insights_list = []
    
    avg_accuracy = np.mean(accuracies)
    if avg_accuracy >= 85:
        insights_list.append("Your accuracy is excellent - you're great at ignoring distracting information.")
    elif avg_accuracy < 70:
        insights_list.append("Focus on accuracy over speed to improve your overall score.")
    
    avg_time = np.mean(times)
    if avg_time < 1200:
        insights_list.append("Your response time is very fast - excellent processing speed!")
    elif avg_time > 2000:
        insights_list.append("Working on response speed could significantly boost your score.")
    
    return {
        'message': trend_message,
        'trend': trend,
        'statistics': {
            'gamesPlayed': len(game_history),
            'averageScore': round(np.mean(scores), 1),
            'bestScore': max(scores),
            'averageAccuracy': round(avg_accuracy, 1),
            'averageTime': round(avg_time, 1)
        },
        'insights': insights_list,
        'recommendations': generate_recommendations(avg_accuracy, avg_time, 70)
    }


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    
    print(f"AI Service starting on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
