const { exec } = require("child_process");
window.addEventListener("DOMContentLoaded", () => {
  const dynamicTable = document.getElementById("table-body");
  const dynamicList = document.getElementById("test-name");
  const { ipcRenderer } = require("electron");
  const directoryPath = "E:/playwright/tests"; // Specify the directory path example : E:/playwright/tests
  ipcRenderer.send("readDirectory", directoryPath);
  ipcRenderer.on("directoryContents", (event, files) => {
    console.log("Files in directory:", files);
    dynamicTable.innerHTML = "";
    let fileObj = [];
    for (const file of files) {
      let mainobj = {
        tesFile: file.split(".")[0],
        execute: "",
        status: "",
        reports: "",
      };
      fileObj.push(mainobj);
    }
    //console.log(fileObj);

    for (let i = 0; i <= fileObj.length; i++) {
      const row = document.createElement("tr");
      row.className = "tableDataRows";
      let runButton = document.createElement("button");
      runButton.className = "runbutton";
      for (const key in fileObj[i]) {
        const cell = document.createElement("td");
        if (key === "execute") {
          //const runButton = document.createElement("button");
          runButton.textContent = "▶️";
          cell.style.textAlign = "center";
          cell.appendChild(runButton);
          row.appendChild(cell);
        } else if (key === "status") {
          runButton.addEventListener("click", () => {
            let statusElement = document.createElement("td");
            let executionPath = directoryPath.split("tests")[0];
            //the below block is a temparory block to display loading or processing icon for status column
            {
              // const divloader = document.createElement("div");
              // divloader.className = "loader";
              // statusElement.appendChild(divloader);
              // cell.appendChild(statusElement);
              statusElement = "Loading...";
              cell.textContent = statusElement;
            }
            console.log(executionPath);
            console.log(
              `npx playwright test tests/${fileObj[i].tesFile}.test.ts`
            );
            exec(
              `npx playwright test tests/${fileObj[i].tesFile}.test.ts ${fileObj[i].tesFile}.spec.ts`,
              {
                cwd: executionPath.toString(),
                shell: "C:\\Windows\\System32\\cmd.exe",
              },
              (error, stdout, stderr) => {
                if (error) {
                  console.error(`Error executing command: ${error}`);
                  //return;
                }
                console.log(`Command output: ${stdout}`);
                const lines = stdout.split("\n");
                if (stdout.includes("Finished the run: passed")) {
                  // const lastLine = lines[lines.length - 7].toUpperCase();
                  // statusElement = lastLine;
                  statusElement = "Passed";
                } else if (
                  stdout.includes("Finished the run: failed") ||
                  stdout.includes("failed")
                ) {
                  // const lastLine = lines[lines.length - 7].toUpperCase();
                  // statusElement = lastLine;
                  statusElement = "Failed";
                } else if (stdout.includes("No tests found")) {
                  statusElement =
                    "No test found please check test command once";
                } else {
                  statusElement = stdout;
                }
                cell.textContent = statusElement;
              }
            );
            // Example: Change the status to "Updated Status"
            // Update the cell content with the new status
            //row.style.backgroundColor = "green"; // Example: Change row color to green when button clicked
            try {
              cell.appendChild(statusElement);
            } catch (error) {
              console.log(`Ignorable : unable to append the child ${error}`);
            }
          });
          row.appendChild(cell);
        } else {
          cell.textContent = fileObj[i][key];
          row.appendChild(cell);
        }
      }
      dynamicTable.appendChild(row);
    }
  });
});
