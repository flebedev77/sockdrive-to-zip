const startNextButton = document.querySelector("#startNext");
let filesystem, drive, driver, allfiles;
const zip = new JSZip();

async function SockDriveFileSystem(owner, disk, token = "") {
  filesystem = await createSockdriveFileSystem("wss://sockdrive.js-dos.com:8001", owner, disk, token, (_read, write) => {
    console.log("Readonly: ", !write);
  }, (e) => {
    console.error(e)
  });

  console.log("Starting read");
  const files = await filesystem.fs.readdir("./");
  console.log(files);

  //filesystem.fs.fs.readFile("./aoe/SOUND/OPEN.MID", {flag: "r", encoding: null}, (err, data) => {
  //  if (err) {
  //    console.error("Error reading file!!!!");
  //  }
  //  console.log(data);
  //  downloadFile("OPEN.MID", data);
  //});


  allfiles = await walkDir("./");
  console.log(allfiles);
}

async function walkDir(path) {
  return new Promise(async (resolve) => {
    console.log("Reading dir: " + path);
    const items = await filesystem.fs.readdir(path);
    let paths = [];

    for (let i = 0; i < items.length; i++) {
      const item = path + items[i];
      console.log("Processing: " + item);
      const isaDir = await isDir(item);
      if (!isaDir) {
        paths.push(item);
      } else {
        paths.push(item + "/");
        paths = [...paths, ...(await walkDir(item + "/"))];
      }
    }
    resolve(paths);
    console.log("Finished processing: " + path);
  });
}

async function isDir(path) {
  return new Promise(async (resolve) => {
    resolve((await filesystem.fs.stat(path)).isDirectory());
  });
}

SockDriveFileSystem("dos.zone", "aoe_d");


async function DriveCopy(owner, disk) {

  const template = await (await fetch(`https://sockdrive.js-dos.com:8001/template/${owner}/${disk}`)).json();
  console.log(template);
  const module = {
    HEAPU8: new Uint8Array(template.sector_size),
  };

  const stats = {
    read: 0,
    write: 0,
    readTotalTime: 0,
    cacheHit: 0,
    cacheMiss: 0,
    cacheUsed: 0,
    io: [],
  };

  drive = new Drive("wss://sockdrive.js-dos.com:8001", owner, disk, "", stats, module,
    new Cache("wss://sockdrive.js-dos.com:8001", false));

  const sectorSize = template.sector_size;

  drive.onOpen((read, write, imageSize) => {
    console.log("Drive opened");
    console.log("Image size: ", imageSize, template.size);
    console.log("Sector size: ", sectorSize, template.sector_size);
    console.log("Readonly: ", !write);
    // TODO: fatfs should respect boot record section
    const MBR_OFFSET = 63;
    driver = {
      sectorSize,
      numSectors: imageSize / sectorSize,
      readSectors: function(start, dst, cb) {
        (async () => {
          start += MBR_OFFSET;
          // TODO we can avoid copying in dst.set
          for (let i = 0; i < dst.length / sectorSize; ++i) {
            if (drive.read(start + i, 0, true) !== 0) {
              const readCode = await drive.read(start + i, 0, false);
              if (readCode !== 0) {
                cb(new Error("Read error, code: " + readCode), dst);
                return;
              }
            }
            dst.set(module.HEAPU8.slice(0, sectorSize), i * sectorSize);
          }
        })()
          .then(() => cb(null, dst))
          .catch((e) => cb(e, dst));
      },
      writeSectors: function(start, data, cb) {
        start += MBR_OFFSET;
        for (let i = 0; i < data.length / sectorSize; ++i) {
          module.HEAPU8.set(data.slice(i * sectorSize, (i + 1) * sectorSize), 0);
          const writeCode = drive.write(start + i, 0);
          if (writeCode !== 0) {
            cb(new Error("Write error, code: " + 0));
            return;
          }
        }
        cb(null);
      },
    };

    let parts = 3;
    let dataSections = [];
    let i = 0;
    console.log(imageSize)
    startNextButton.onclick = function() {
      dataSections.push(new Uint8Array(Math.ceil(imageSize/parts)));
      driver.readSectors(0, dataSections[i], (e, data) => {
        if (e) {
          console.error(e);
        }
        console.log(data);
      })
      downloadFile("filesystem", dataSections[i], i);
      i++;
    }

  });

}

function downloadFile(filename, data) {
  const blob = new Blob([data], { type: 'application/octet-stream' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


//DriveCopy("dos.zone", "aoe_d");

