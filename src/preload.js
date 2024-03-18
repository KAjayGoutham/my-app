const { exec } = require("child_process");
window.addEventListener("DOMContentLoaded", () => {
  const dynamicTable = document.getElementById("table-body");
  const dynamicList = document.getElementById("test-name");
  const { ipcRenderer } = require("electron");
  const directoryPath = "E:/playwright/tests"; // Specify the directory path
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
      let runButton = document.createElement("button");
      for (const key in fileObj[i]) {
        const cell = document.createElement("td");
        if (key === "execute" || key === "testFile") {
          //const runButton = document.createElement("button");
          runButton.textContent = "Run";
          cell.appendChild(runButton);
          row.appendChild(cell);
        } else if (key === "status" || key === "testFile") {
          runButton.addEventListener("click", () => {
            let statusElement = document.createElement("td");
            let executionPath = directoryPath.split("tests");
            console.log(
              `npx cross-env ENV=uat playwright test tests/${fileObj[i].tesFile}.test.ts --project=Chrome`
            );
            exec(
              `npx cross-env ENV=uat playwright test tests/${fileObj[i].tesFile}.test.ts tests/${fileObj[i].tesFile}.spec.ts --project=Chrome`,
              {
                cwd: executionPath.toString(),
                shell: "C:\\Windows\\System32\\cmd.exe",
              },
              (error, stdout, stderr) => {
                if (error) {
                  console.error(`Error executing command: ${error}`);
                  return;
                }
                console.log(`Command output: ${stdout}`);
              }
            );
            statusElement = "passed"; // Example: Change the status to "Updated Status"
            cell.textContent = statusElement; // Update the cell content with the new status
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
