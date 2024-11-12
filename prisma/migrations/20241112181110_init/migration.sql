-- CreateIndex
CREATE INDEX "Pet_type_idx" ON "Pet"("type");

-- CreateIndex
CREATE INDEX "Pet_gender_idx" ON "Pet"("gender");

-- CreateIndex
CREATE INDEX "Reminder_date_idx" ON "Reminder"("date");

-- CreateIndex
CREATE INDEX "Reminder_userId_idx" ON "Reminder"("userId");
