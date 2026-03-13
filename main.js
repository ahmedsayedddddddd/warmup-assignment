const fs = require("fs");

// ============================================================
// Function 1: getShiftDuration(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getShiftDuration(startTime, endTime) {
  // TODO: Implement this function

  //! startTime
  let startParts = startTime.trim().split(" ");
  let startPeriod = startParts[1].toLowerCase();
  let startHMS = startParts[0].split(":");
  let startH = parseInt(startHMS[0]);
  let startM = parseInt(startHMS[1]);
  let startS = parseInt(startHMS[2]);
  if (startPeriod === "am" && startH === 12) startH = 0;
  if (startPeriod === "pm" && startH !== 12) startH += 12;
  let startTotal = startH * 3600 + startM * 60 + startS;

  //! endTime
  let endParts = endTime.trim().split(" ");
  let endPeriod = endParts[1].toLowerCase();
  let endHMS = endParts[0].split(":");
  let endH = parseInt(endHMS[0]);
  let endM = parseInt(endHMS[1]);
  let endS = parseInt(endHMS[2]);
  if (endPeriod === "am" && endH === 12) endH = 0;
  if (endPeriod === "pm" && endH !== 12) endH += 12;
  let endTotal = endH * 3600 + endM * 60 + endS;

  //! calculate difference
  let diff = endTotal - startTotal;
  let h = Math.floor(diff / 3600);
  let m = Math.floor((diff % 3600) / 60);
  let s = diff % 60;

  return (
    h +
    ":" +
    m.toString().padStart(2, "0") +
    ":" +
    s.toString().padStart(2, "0")
  );
}

// ============================================================
// Function 2: getIdleTime(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getIdleTime(startTime, endTime) {
  // TODO: Implement this function

  //! startTime
  let startParts = startTime.trim().split(" ");
  let startPeriod = startParts[1].toLowerCase();
  let startHMS = startParts[0].split(":");
  let startH = parseInt(startHMS[0]);
  let startM = parseInt(startHMS[1]);
  let startS = parseInt(startHMS[2]);
  if (startPeriod === "am" && startH === 12) startH = 0;
  if (startPeriod === "pm" && startH !== 12) startH += 12;
  let startTotal = startH * 3600 + startM * 60 + startS;

  //! endTime
  let endParts = endTime.trim().split(" ");
  let endPeriod = endParts[1].toLowerCase();
  let endHMS = endParts[0].split(":");
  let endH = parseInt(endHMS[0]);
  let endM = parseInt(endHMS[1]);
  let endS = parseInt(endHMS[2]);
  if (endPeriod === "am" && endH === 12) endH = 0;
  if (endPeriod === "pm" && endH !== 12) endH += 12;
  let endTotal = endH * 3600 + endM * 60 + endS;

  //! delivery hours: 8:00 AM to 10:00 PM
  let deliveryStart = 8 * 3600; // 08:00:00
  let deliveryEnd = 22 * 3600; // 22:00:00

  let idle = 0;

  //! time before 8 AM
  if (startTotal < deliveryStart) {
    idle += Math.min(endTotal, deliveryStart) - startTotal;
  }

  //! time after 10 PM
  if (endTotal > deliveryEnd) {
    idle += endTotal - Math.max(startTotal, deliveryEnd);
  }

  let h = Math.floor(idle / 3600);
  let m = Math.floor((idle % 3600) / 60);
  let s = idle % 60;

  return (
    h +
    ":" +
    m.toString().padStart(2, "0") +
    ":" +
    s.toString().padStart(2, "0")
  );
}

// ============================================================
// Function 3: getActiveTime(shiftDuration, idleTime)
// shiftDuration: (typeof string) formatted as h:mm:ss
// idleTime: (typeof string) formatted as h:mm:ss
// Returns: string formatted as h:mm:ss
// ============================================================
function getActiveTime(shiftDuration, idleTime) {
  // TODO: Implement this function

  //! shiftDuration
  let shiftParts = shiftDuration.trim().split(":");
  let shiftTotal =
    parseInt(shiftParts[0]) * 3600 +
    parseInt(shiftParts[1]) * 60 +
    parseInt(shiftParts[2]);

  //! idleTime
  let idleParts = idleTime.trim().split(":");
  let idleTotal =
    parseInt(idleParts[0]) * 3600 +
    parseInt(idleParts[1]) * 60 +
    parseInt(idleParts[2]);

  let active = shiftTotal - idleTotal;
  let h = Math.floor(active / 3600);
  let m = Math.floor((active % 3600) / 60);
  let s = active % 60;

  return (
    h +
    ":" +
    m.toString().padStart(2, "0") +
    ":" +
    s.toString().padStart(2, "0")
  );
}

// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
  // TODO: Implement this function

  //! get date
  let dateParts = date.split("-");
  let year = parseInt(dateParts[0]);
  let month = parseInt(dateParts[1]);
  let day = parseInt(dateParts[2]);

  //! get activeTime
  let activeParts = activeTime.trim().split(":");
  let activeTotal =
    parseInt(activeParts[0]) * 3600 +
    parseInt(activeParts[1]) * 60 +
    parseInt(activeParts[2]);

  //? Eid al-Fitr: April 10-30, 2025 > quota = 6 hours
  //? Normal daily quota = 8 hours 24 minutes
  let quota;
  if (year === 2025 && month === 4 && day >= 10 && day <= 30) {
    quota = 6 * 3600;
  } else {
    quota = 8 * 3600 + 24 * 60;
  }

  return activeTotal >= quota;
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
  // TODO: Implement this function

  let driverID = shiftObj.driverID;
  let driverName = shiftObj.driverName;
  let date = shiftObj.date;
  let startTime = shiftObj.startTime;
  let endTime = shiftObj.endTime;

  //! read file
  let raw = fs.readFileSync(textFile, { encoding: "utf8" });
  let lines = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  //! check for duplicate entries (if same driverID & same date)
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    let cols = lines[i].split(",");
    if (cols[0].trim() === driverID && cols[2].trim() === date) {
      return {};
    }
  }

  //! calculate derived fields
  let shiftDuration = getShiftDuration(startTime, endTime);
  let idleTime = getIdleTime(startTime, endTime);
  let activeTime = getActiveTime(shiftDuration, idleTime);
  let quota = metQuota(date, activeTime);
  let hasBonus = false;

  //! build new CSV line
  let newLine =
    driverID +
    "," +
    driverName +
    "," +
    date +
    "," +
    startTime +
    "," +
    endTime +
    "," +
    shiftDuration +
    "," +
    idleTime +
    "," +
    activeTime +
    "," +
    quota +
    "," +
    hasBonus;

  //! find insertion point (after last record of the driverID)
  let insertAt = -1;
  for (let i = lines.length - 1; i >= 1; i--) {
    if (!lines[i].trim()) continue;
    if (lines[i].split(",")[0].trim() === driverID) {
      insertAt = i;
      break;
    }
  }

  //! remove empty lines
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

  if (insertAt === -1) {
    lines.push(newLine);
  } else {
    lines.splice(insertAt + 1, 0, newLine);
  }

  fs.writeFileSync(textFile, lines.join("\n") + "\n", { encoding: "utf8" });

  //! return new record as object
  return {
    driverID: driverID,
    driverName: driverName,
    date: date,
    startTime: startTime,
    endTime: endTime,
    shiftDuration: shiftDuration,
    idleTime: idleTime,
    activeTime: activeTime,
    metQuota: quota,
    hasBonus: hasBonus,
  };
}

// ============================================================
// Function 6: setBonus(textFile, driverID, date, newValue)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// date: (typeof string) formatted as yyyy-mm-dd
// newValue: (typeof boolean)
// Returns: nothing (void)
// ============================================================
function setBonus(textFile, driverID, date, newValue) {
  // TODO: Implement this function

  let raw = fs.readFileSync(textFile, { encoding: "utf8" });
  let lines = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    let cols = lines[i].split(",");
    if (cols[0].trim() === driverID && cols[2].trim() === date) {
      cols[9] = newValue.toString();
      lines[i] = cols.join(",");
      break;
    }
  }

  fs.writeFileSync(textFile, lines.join("\n"), { encoding: "utf8" });
}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
  // TODO: Implement this function

  let raw = fs.readFileSync(textFile, { encoding: "utf8" });
  let lines = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  let targetMonth = parseInt(month).toString().padStart(2, "0");

  let found = false;
  let count = 0;

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    let cols = lines[i].split(",");
    if (cols[0].trim() !== driverID) continue;

    found = true;
    let recordMonth = cols[2].trim().split("-")[1]; // "04"
    if (recordMonth === targetMonth && cols[9].trim() === "true") {
      count++;
    }
  }

  return found ? count : -1;
}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
  // TODO: Implement this function

  let raw = fs.readFileSync(textFile, { encoding: "utf8" });
  let lines = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  let total = 0;

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    let cols = lines[i].split(",");
    if (cols[0].trim() !== driverID) continue;

    let recordMonth = parseInt(cols[2].trim().split("-")[1]);
    if (recordMonth !== month) continue;

    //! activeTime at column index 7 (probably)
    let activeParts = cols[7].trim().split(":");
    total +=
      parseInt(activeParts[0]) * 3600 +
      parseInt(activeParts[1]) * 60 +
      parseInt(activeParts[2]);
  }

  let h = Math.floor(total / 3600);
  let m = Math.floor((total % 3600) / 60);
  let s = total % 60;

  return (
    h +
    ":" +
    m.toString().padStart(2, "0") +
    ":" +
    s.toString().padStart(2, "0")
  );
}

// ============================================================
// Function 9: getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)
// textFile: (typeof string) path to shifts text file
// rateFile: (typeof string) path to driver rates text file
// bonusCount: (typeof number) total bonuses for given driver per month
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getRequiredHoursPerMonth(
  textFile,
  rateFile,
  bonusCount,
  driverID,
  month,
) {
  // TODO: Implement this function

  //! get driver's day off from rate file
  let rateRaw = fs.readFileSync(rateFile, { encoding: "utf8" });
  let rateLines = rateRaw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n");

  let dayOffName = "";
  for (let i = 0; i < rateLines.length; i++) {
    if (!rateLines[i].trim()) continue;
    let cols = rateLines[i].split(",");
    if (cols[0].trim() === driverID) {
      dayOffName = cols[1].trim().toLowerCase();
      break;
    }
  }

  //! map day name to JS day number (0 = Sunday ... 6 = Saturday)
  let dayMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  let dayOffNum = dayMap[dayOffName];

  //! loop shift records
  let raw = fs.readFileSync(textFile, { encoding: "utf8" });
  let lines = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  let total = 0;

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    let cols = lines[i].split(",");
    if (cols[0].trim() !== driverID) continue;

    let dateParts = cols[2].trim().split("-");
    let year = parseInt(dateParts[0]);
    let recordMonth = parseInt(dateParts[1]);
    let day = parseInt(dateParts[2]);

    if (recordMonth !== month) continue;

    //! skip if shift falls on driver's day off
    let shiftDate = new Date(year, recordMonth - 1, day);
    if (shiftDate.getDay() === dayOffNum) continue;

    //! quota for the date
    let quota;
    if (year === 2025 && recordMonth === 4 && day >= 10 && day <= 30) {
      quota = 6 * 3600;
    } else {
      quota = 8 * 3600 + 24 * 60;
    }

    total += quota;
  }

  //! decrease 2 hours per bonus
  total -= bonusCount * 2 * 3600;

  let h = Math.floor(total / 3600);
  let m = Math.floor((total % 3600) / 60);
  let s = total % 60;

  return (
    h +
    ":" +
    m.toString().padStart(2, "0") +
    ":" +
    s.toString().padStart(2, "0")
  );
}

// ============================================================
// Function 10: getNetPay(driverID, actualHours, requiredHours, rateFile)
// driverID: (typeof string)
// actualHours: (typeof string) formatted as hhh:mm:ss
// requiredHours: (typeof string) formatted as hhh:mm:ss
// rateFile: (typeof string) path to driver rates text file
// Returns: integer (net pay)
// ============================================================
function getNetPay(driverID, actualHours, requiredHours, rateFile) {
  // TODO: Implement this function

  //!  read driver's basePay and tier
  let raw = fs.readFileSync(rateFile, { encoding: "utf8" });
  let lines = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  let basePay = 0;
  let tier = 0;

  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    let cols = lines[i].split(",");
    if (cols[0].trim() === driverID) {
      basePay = parseInt(cols[2].trim());
      tier = parseInt(cols[3].trim());
      break;
    }
  }

  //! allowed missing hours per tier with no deduction
  let allowed;
  if (tier === 1) allowed = 50;
  else if (tier === 2) allowed = 20;
  else if (tier === 3) allowed = 10;
  else allowed = 3; // tier 4

  //! get actualHours
  let actualParts = actualHours.trim().split(":");
  let actualTotal =
    parseInt(actualParts[0]) * 3600 +
    parseInt(actualParts[1]) * 60 +
    parseInt(actualParts[2]);

  //! get requiredHours
  let reqParts = requiredHours.trim().split(":");
  let reqTotal =
    parseInt(reqParts[0]) * 3600 +
    parseInt(reqParts[1]) * 60 +
    parseInt(reqParts[2]);

  //! no deduction if actual >= required
  if (actualTotal >= reqTotal) {
    return basePay;
  }

  let missingSeconds = reqTotal - actualTotal;
  let missingHours = missingSeconds / 3600;

  //! remove tier allowance (only full hours are billed)
  let billable = Math.max(0, missingHours - allowed);
  let billableHours = Math.floor(billable);

  let deductionRate = Math.floor(basePay / 185);
  let deduction = billableHours * deductionRate;

  return basePay - deduction;
}

module.exports = {
  getShiftDuration,
  getIdleTime,
  getActiveTime,
  metQuota,
  addShiftRecord,
  setBonus,
  countBonusPerMonth,
  getTotalActiveHoursPerMonth,
  getRequiredHoursPerMonth,
  getNetPay,
};
