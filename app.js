const moment = require("moment-timezone");
const readline = require("readline");

const timeZoneJsonData = require("./timezones.json");

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt the user to enter their desired time zone
rl.question("CURRENT_TIMEZONE:", (zone) => {
  const currentTimeZone = timeZoneJsonData.find((items) => items.abbr === zone);

  if (currentTimeZone) {
    const userTimeZone = currentTimeZone.utc[0];
    if (!moment.tz.zone(userTimeZone)) {
      console.log("Invalid time zone!");
      rl.close();
      return;
    }
    // Set the user's time zone
    moment.tz.setDefault(userTimeZone);
    // Prompt the user to enter a specific time
    rl.question("CURRENT_TIME:", (userTime) => {
      // Parse and validate the user's entered time
      const parsedUserTime = moment(userTime, "hh:mm a", true);

      if (!parsedUserTime.isValid()) {
        console.log("Invalid time format!");
        rl.close();
        return;
      }

      // Convert the entered time to the desired time zone
      const convertedTime = parsedUserTime.clone().tz(userTimeZone);

      // Display the converted time
      console.log(`Entered time in ${zone}:`, convertedTime.format("hh:mm a"));
      // Prompt the user to enter a different time zone to convert

      rl.question("CONVERT_TO_TIMEZONE:", (convertZone) => {
        const specificTimeZone = timeZoneJsonData.find(
          (items) => items.abbr === convertZone
        );
        const convertTimezone = specificTimeZone.utc[0];
        if (!specificTimeZone) {
          console.log("Invalid Converter time zone");
        } else {
          if (!moment.tz.zone(convertTimezone)) {
            console.log("Invalid time zone!");
            rl.close();
            return;
          }

          const convertTime= parsedUserTime.clone().tz(convertTimezone);

          console.log(
            `Entered time in ${specificTimeZone.abbr}:`,
            convertTime.format("hh:mm a")
          );
          rl.close();
        }
      });
    });
  } else {
    console.log("Invalid time zone");
  }
});
