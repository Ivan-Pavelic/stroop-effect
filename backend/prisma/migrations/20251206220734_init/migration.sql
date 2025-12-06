-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "ime" TEXT NOT NULL,
    "prezime" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "spol" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lozinka_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "datum" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trajanje" INTEGER NOT NULL,
    "broj_zadataka" INTEGER NOT NULL,
    "broj_pogresaka" INTEGER NOT NULL,
    "prosjecno_vrijeme_odgovora" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "results" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "tocnost" DOUBLE PRECISION NOT NULL,
    "brzina" DOUBLE PRECISION NOT NULL,
    "kognitivni_score" INTEGER NOT NULL,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_tasks" (
    "id" SERIAL NOT NULL,
    "task_text" TEXT NOT NULL,
    "boja_teksta" TEXT NOT NULL,
    "tocan_odgovor" TEXT NOT NULL,
    "tezina" TEXT NOT NULL,

    CONSTRAINT "ai_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_analysis" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rezultat_ai" TEXT NOT NULL,
    "datum" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "komentar" TEXT NOT NULL,
    "ocjena" INTEGER NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "results_game_id_key" ON "results"("game_id");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_analysis" ADD CONSTRAINT "ai_analysis_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
