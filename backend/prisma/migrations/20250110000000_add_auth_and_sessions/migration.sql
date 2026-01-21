-- AlterTable: Add username and role to users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "username" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'USER';

-- CreateIndex: Make username unique
CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username");

-- CreateIndex: Add index on username
CREATE INDEX IF NOT EXISTS "users_username_idx" ON "users"("username");

-- AlterTable: Add congruent/incongruent fields to games
ALTER TABLE "games" ADD COLUMN IF NOT EXISTS "broj_kongruentnih" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "games" ADD COLUMN IF NOT EXISTS "broj_nekongruentnih" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "games" ADD COLUMN IF NOT EXISTS "tocnost_kongruentnih" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "games" ADD COLUMN IF NOT EXISTS "tocnost_nekongruentnih" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable: GameSession for trial-level data
CREATE TABLE IF NOT EXISTS "game_sessions" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "trial_number" INTEGER NOT NULL,
    "is_congruent" BOOLEAN NOT NULL,
    "word_text" TEXT NOT NULL,
    "display_color" TEXT NOT NULL,
    "correct_answer" TEXT NOT NULL,
    "user_answer" TEXT,
    "is_correct" BOOLEAN NOT NULL,
    "reaction_time" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "game_sessions_game_id_idx" ON "game_sessions"("game_id");
CREATE INDEX IF NOT EXISTS "game_sessions_user_id_idx" ON "game_sessions"("user_id");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'game_sessions_game_id_fkey'
    ) THEN
        ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_game_id_fkey" 
            FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'game_sessions_user_id_fkey'
    ) THEN
        ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_user_id_fkey" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
