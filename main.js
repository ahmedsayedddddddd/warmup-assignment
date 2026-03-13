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

  // Eid al-Fitr: April 10-30, 2025 > quota = 6 hours
  // Normal daily quota = 8 hours 24 minutes
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

    //! find insertion point (after last record of this driverID)
    let insertAt = -1;
    for (let i = lines.length - 1; i >= 1; i--) {
      if (!lines[i].trim()) continue;
      if (lines[i].split(",")[0].trim() === driverID) {
        insertAt = i;
        break;
      }
    }

    //! remove  empty lines
    while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
      lines.pop();
    }

    if (insertAt === -1) {
      // driverID not in file -> append at end
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
