const startButton = document.querySelector("#start");
const cancelButton = document.querySelector("#cancel");
const skipButton = document.querySelector("#skip");
const logArea = document.querySelector("textarea");

const advancedTitle = document.querySelector("#advancedTitle");
const advancedContent = document.querySelector("#advancedContent");

advancedContent.style.display = "none";
advancedTitle.onclick = function() {
  advancedContent.style.display = (advancedContent.style.display == "none") ? "" : "none";

  if (advancedContent.style.display == "none") {
    advancedTitle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-360 280-560h400L480-360Z"/></svg>
            <p style="user-select: none;">Advanced Options</p>
`;
  } else {
    advancedTitle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="m280-400 200-200 200 200H280Z"/></svg><p style="user-select: none;">Advanced Options</p>`;
  }
}

const diskIdInput = document.querySelector("#diskId");
const diskOwnerInput = document.querySelector("#diskOwner");
const sockdriveEndpointInput = document.querySelector("#sockdriveEndpoint");
const selectedDirInput = document.querySelector("#selectedDir");
const importFileUploadInput = document.querySelector("#importFileUploadInput");

const walkButton = document.querySelector("#walk");
const importWalkButton = document.querySelector("#import");
const exportWalkButton = document.querySelector("#export");



let filesystem, drive, driver, allfiles, zip, zipFilename;
let skip = false;

console.log = function(text) {
  logArea.value += text + "\n";
  logArea.scrollTo(0, logArea.scrollHeight);
}

async function SockDriveFileSystem(owner, disk, token = "", walk = false) {
  console.log("Starting");
  console.log("Connecting...");
  filesystem = await createSockdriveFileSystem(sockdriveEndpointInput.value, owner, disk, token, (_read, write) => {
    console.log("Connected");
    console.log("Readonly: " + (!write));
  }, (e) => {
    console.error(e)
  });

  console.log("Starting read");
  const files = await filesystem.fs.readdir("./");
  console.log(JSON.stringify({files}));

  //filesystem.fs.fs.readFile("./aoe/SOUND/OPEN.MID", {flag: "r", encoding: null}, (err, data) => {
  //  if (err) {
  //    console.error("Error reading file!!!!");
  //  }
  //  console.log(data);
  //  downloadFile("OPEN.MID", data);
  //});

  if (walk) {
    let selectedPath = selectedDirInput.value;
    if (selectedPath.charAt(0) != ".") {
      selectedPath = "./" + selectedPath;
    } 
    if (selectedPath.charAt(selectedPath.length-1) != "/") {
      selectedPath += "/";
    }
    allfiles = await walkDir(selectedPath);
    console.log("Finished walking... You should export!");
    await filesystem.close();
    return
  }
  
  if (allfiles == null || allfiles.length == 0) {
    console.log("Please get walkdata");
    await filesystem.close();
    return;
  }


  //allfiles = await walkDir("./");
  //allfiles = [
//  "./aoe/", "./aoe/.jsdos/", "./aoe/.jsdos/dosbox.conf", "./aoe/.jsdos/jsdos.json", "./aoe/.jsdos/readme.txt", "./aoe/AELAUNCH.DLL", "./aoe/AOEHLP.DLL", "./aoe/AOEger_1.0b_noCD", "./aoe/AVI/", "./aoe/AVI/BAB1.AVI", "./aoe/AVI/BAB2.AVI", "./aoe/AVI/EGYP1.AVI", "./aoe/AVI/EGYP2.AVI", "./aoe/AVI/GREEK1.AVI", "./aoe/AVI/GREEK2.AVI", "./aoe/AVI/INTRO.AVI", "./aoe/AVI/INTROX.AVI", "./aoe/AVI/LOGO1.AVI", "./aoe/AVI/LOGO2.AVI", "./aoe/AVI/YAMA1.AVI", "./aoe/AVI/YAMA2.AVI", "./aoe/CAMPAIGN/", "./aoe/CAMPAIGN/ASCENT_1.CPN", "./aoe/CAMPAIGN/EXPANS_1.CPX", "./aoe/CAMPAIGN/EXPANS_2.CPX", "./aoe/CAMPAIGN/EXPANS_3.CPX", "./aoe/CAMPAIGN/EXPANS_4.CPX", "./aoe/CAMPAIGN/GLORYO_1.CPN", "./aoe/CAMPAIGN/VOICES_1.CPN", "./aoe/CAMPAIGN/YAMATO_1.CPN", "./aoe/DATA/", "./aoe/DATA/AGGRES_1.PER", "./aoe/DATA/AGGRES_2.PER", "./aoe/DATA/AGGRES_3.PER", "./aoe/DATA/AOE.PLY", "./aoe/DATA/ARCHER_1.AI", "./aoe/DATA/ARCHER_2.AI", "./aoe/DATA/ASSYRI_1.AI", "./aoe/DATA/ASSYRI_2.AI", "./aoe/DATA/BABYLO_1.AI", "./aoe/DATA/BABYLO_2.AI", "./aoe/DATA/BORDER.DRS", "./aoe/DATA/CAVALR_1.AI", "./aoe/DATA/CAVALR_2.AI", "./aoe/DATA/CAVARC_1.AI", "./aoe/DATA/CHOSON_1.AI", "./aoe/DATA/CHOSON_2.AI", "./aoe/DATA/CLOSEDPW.EXE", "./aoe/DATA/DE316F_1.AI", "./aoe/DATA/DE34C1_1.AI", "./aoe/DATA/DE451C_1.AI", "./aoe/DATA/DE494F_1.AI", "./aoe/DATA/DE4EF6_1.AI", "./aoe/DATA/DE4FE1_1.AI", "./aoe/DATA/DE5149_1.AI", "./aoe/DATA/DE8DFC_1.AI", "./aoe/DATA/DEATHM_1.AI", "./aoe/DATA/DEATHM_2.AI", "./aoe/DATA/DEATHM_3.AI", "./aoe/DATA/DEATHM_4.AI", "./aoe/DATA/DEFAULT.CTY", "./aoe/DATA/DEFAULT.PER", "./aoe/DATA/DEFENS_1.PER", "./aoe/DATA/EGYPTC_1.AI", "./aoe/DATA/EGYPTW_1.AI", "./aoe/DATA/ELEPHA_1.AI", "./aoe/DATA/EMPIRES.DAT", "./aoe/DATA/GRAPHICS.DRS", "./aoe/DATA/GREEKP_1.AI", "./aoe/DATA/HITTIT_1.AI", "./aoe/DATA/HITTIT_2.AI", "./aoe/DATA/IM04FA_1.AI", "./aoe/DATA/IM867C_1.AI", "./aoe/DATA/IMMORT_1.AI", "./aoe/DATA/IMMORT_2.AI", "./aoe/DATA/IMMORT_3.AI", "./aoe/DATA/IMMORT_4.AI", "./aoe/DATA/INFANT_1.AI", "./aoe/DATA/INFANT_2.AI", "./aoe/DATA/INFANT_3.AI", "./aoe/DATA/INTERFAC.DRS", "./aoe/DATA/LIST.CR", "./aoe/DATA/MINOAC_1.AI", "./aoe/DATA/PASSIVE.PER", "./aoe/DATA/PASSIV_1.PER", "./aoe/DATA/PERSIA_1.AI", "./aoe/DATA/PHALAN_1.AI", "./aoe/DATA/PHALAN_2.AI", "./aoe/DATA/PHOENI_1.AI", "./aoe/DATA/PRIEST_1.AI", "./aoe/DATA/PRIEST_2.AI", "./aoe/DATA/RULES.RPS", "./aoe/DATA/SHADOW.COL", "./aoe/DATA/SHANGC_1.AI", "./aoe/DATA/SHANGC_2.AI", "./aoe/DATA/SHANGH_1.AI", "./aoe/DATA/SOUNDS.DRS", "./aoe/DATA/SUMERI_1.AI", "./aoe/DATA/SUMERI_2.AI", "./aoe/DATA/SUPERA_1.PER", "./aoe/DATA/TERRAIN.DRS", "./aoe/DATA/TILEEDGE.DAT", "./aoe/DATA/TRIREM_1.AI", "./aoe/DATA/TRIREM_2.AI", "./aoe/DATA/WARELE_1.AI", "./aoe/DATA/YAMATO_1.AI", "./aoe/DATA2/", "./aoe/DATA2/AGGRES_1.PER", "./aoe/DATA2/AGGRES_2.PER", "./aoe/DATA2/AGGRES_3.PER", "./aoe/DATA2/AOE.PLY", "./aoe/DATA2/ARCHER_1.AI", "./aoe/DATA2/ARCHER_2.AI", "./aoe/DATA2/AS2C33_1.AI", "./aoe/DATA2/AS5853_1.AI", "./aoe/DATA2/AS87A7_1.AI", "./aoe/DATA2/ASSYRI_1.AI", "./aoe/DATA2/ASSYRI_2.AI", "./aoe/DATA2/ASSYRI_3.AI", "./aoe/DATA2/ASSYRI_4.AI", "./aoe/DATA2/BABYLO_1.AI", "./aoe/DATA2/BABYLO_2.AI", "./aoe/DATA2/BABYLO_3.AI", "./aoe/DATA2/BLKEDGE.DAT", "./aoe/DATA2/CARTHA_1.AI", "./aoe/DATA2/CARTHA_2.AI", "./aoe/DATA2/CARTHA_3.AI", "./aoe/DATA2/CARTHA_4.AI", "./aoe/DATA2/CAVALR_1.AI", "./aoe/DATA2/CAVALR_2.AI", "./aoe/DATA2/CAVARC_1.AI", "./aoe/DATA2/CHB24F_1.AI", "./aoe/DATA2/CHOSON_1.AI", "./aoe/DATA2/CHOSON_2.AI", "./aoe/DATA2/CHOSON_3.AI", "./aoe/DATA2/CHOSON_4.AI", "./aoe/DATA2/CLOSEDPW.EXE", "./aoe/DATA2/DE041C_1.AI", "./aoe/DATA2/DE0555_1.AI", "./aoe/DATA2/DE0728_1.AI", "./aoe/DATA2/DE0857_1.AI", "./aoe/DATA2/DE390D_1.AI", "./aoe/DATA2/DE3B94_1.AI", "./aoe/DATA2/DE47E3_1.AI", "./aoe/DATA2/DE5020_1.AI", "./aoe/DATA2/DE5214_1.AI", "./aoe/DATA2/DE563C_1.AI", "./aoe/DATA2/DE586E_1.AI", "./aoe/DATA2/DE5C7F_1.AI", "./aoe/DATA2/DE627B_1.AI", "./aoe/DATA2/DE68A9_1.AI", "./aoe/DATA2/DE7099_1.AI", "./aoe/DATA2/DE7730_1.AI", "./aoe/DATA2/DE788F_1.AI", "./aoe/DATA2/DE7C30_1.AI", "./aoe/DATA2/DE871E_1.AI", "./aoe/DATA2/DE8A24_1.AI", "./aoe/DATA2/DE8CE6_1.AI", "./aoe/DATA2/DE97DD_1.AI", "./aoe/DATA2/DE9F16_1.AI", "./aoe/DATA2/DEATHM_1.AI", "./aoe/DATA2/DEATHM_2.AI", "./aoe/DATA2/DEATHM_3.AI", "./aoe/DATA2/DEATHM_4.AI", "./aoe/DATA2/DEC4AF_1.AI", "./aoe/DATA2/DEC9A9_1.AI", "./aoe/DATA2/DEE6E0_1.AI", "./aoe/DATA2/DEE924_1.AI", "./aoe/DATA2/DEF675_1.AI", "./aoe/DATA2/DEFAULT.AI", "./aoe/DATA2/DEFAULT.CTY", "./aoe/DATA2/DEFAULT.PER", "./aoe/DATA2/DEFENS_1.PER", "./aoe/DATA2/EGYPTA_1.AI", "./aoe/DATA2/EGYPTA_2.AI", "./aoe/DATA2/EGYPTC_1.AI", "./aoe/DATA2/EGYPTC_2.AI", "./aoe/DATA2/EGYPTW_1.AI", "./aoe/DATA2/EGYPTW_2.AI", "./aoe/DATA2/ELEPHA_1.AI", "./aoe/DATA2/EMPIRES.DAT", "./aoe/DATA2/FIREGA_1.AI", "./aoe/DATA2/FIREGA_2.AI", "./aoe/DATA2/GRAPHICS.DRS", "./aoe/DATA2/GREEKB_1.AI", "./aoe/DATA2/GREEKI_1.AI", "./aoe/DATA2/GREEKP_1.AI", "./aoe/DATA2/GREEKP_2.AI", "./aoe/DATA2/GREEKS_1.AI", "./aoe/DATA2/HITTIT_1.AI", "./aoe/DATA2/HITTIT_2.AI", "./aoe/DATA2/HITTIT_3.AI", "./aoe/DATA2/HITTIT_4.AI", "./aoe/DATA2/IM25D5_1.AI", "./aoe/DATA2/IM96EF_1.AI", "./aoe/DATA2/IMMORT_1.AI", "./aoe/DATA2/IMMORT_2.AI", "./aoe/DATA2/IMMORT_3.AI", "./aoe/DATA2/IMMORT_4.AI", "./aoe/DATA2/INFANT_1.AI", "./aoe/DATA2/INFANT_2.AI", "./aoe/DATA2/INFANT_3.AI", "./aoe/DATA2/INTERFAC.DRS", "./aoe/DATA2/LIST.CR", "./aoe/DATA2/MA4815_1.AI", "./aoe/DATA2/MACEDO_1.AI", "./aoe/DATA2/MACEDO_2.AI", "./aoe/DATA2/MACEDO_3.AI", "./aoe/DATA2/MACEDO_4.AI", "./aoe/DATA2/MINOAB_1.AI", "./aoe/DATA2/MINOAC_1.AI", "./aoe/DATA2/MINOAI_1.AI", "./aoe/DATA2/PAEEF5_1.AI", "./aoe/DATA2/PALMYR_1.AI", "./aoe/DATA2/PALMYR_2.AI", "./aoe/DATA2/PALMYR_3.AI", "./aoe/DATA2/PALMYR_4.AI", "./aoe/DATA2/PASSIVE.PER", "./aoe/DATA2/PASSIV_1.PER", "./aoe/DATA2/PEBB54_1.AI", "./aoe/DATA2/PERSIA_1.AI", "./aoe/DATA2/PERSIA_2.AI", "./aoe/DATA2/PERSIA_3.AI", "./aoe/DATA2/PERSIA_4.AI", "./aoe/DATA2/PHALAN_1.AI", "./aoe/DATA2/PHALAN_2.AI", "./aoe/DATA2/PHOENI_1.AI", "./aoe/DATA2/PHOENI_2.AI", "./aoe/DATA2/PRIEST_1.AI", "./aoe/DATA2/PRIEST_2.AI", "./aoe/DATA2/ROMEAX_1.AI", "./aoe/DATA2/ROMEBR_1.AI", "./aoe/DATA2/ROMEIR_1.AI", "./aoe/DATA2/ROMELE_1.AI", "./aoe/DATA2/ROMESI_1.AI", "./aoe/DATA2/RULES.RPS", "./aoe/DATA2/SHADOW.COL", "./aoe/DATA2/SHANGC_1.AI", "./aoe/DATA2/SHANGC_2.AI", "./aoe/DATA2/SHANGH_1.AI", "./aoe/DATA2/SHANGW_1.AI", "./aoe/DATA2/SOUNDS.DRS", "./aoe/DATA2/SU04E1_1.AI", "./aoe/DATA2/SUMERI_1.AI", "./aoe/DATA2/SUMERI_2.AI", "./aoe/DATA2/SUMERI_3.AI", "./aoe/DATA2/SUMERI_4.AI", "./aoe/DATA2/SUPERA_1.PER", "./aoe/DATA2/TILEEDGE.DAT", "./aoe/DATA2/TRIREM_1.AI", "./aoe/DATA2/TRIREM_2.AI", "./aoe/DATA2/WARELE_1.AI", "./aoe/DATA2/YAMATO_1.AI", "./aoe/DATA2/YAMATO_2.AI", "./aoe/DATA2/YAMATO_3.AI", "./aoe/EMPIRES.EXE", "./aoe/EMPIRES.HLP", "./aoe/EMPIRESX.EXE", "./aoe/HELP/", "./aoe/HELP/5028.WAV", "./aoe/HELP/5074.WAV", "./aoe/HELP/5144.WAV", "./aoe/HELP/5169.WAV", "./aoe/HELP/ABADACUS.WAV", "./aoe/HELP/ACADEMY.WAV", "./aoe/HELP/ARCHERY.WAV", "./aoe/HELP/ATTACK.WAV", "./aoe/HELP/BALLISTA.WAV", "./aoe/HELP/BARRACK.WAV", "./aoe/HELP/BARRACKS.WAV", "./aoe/HELP/BOAT.WAV", "./aoe/HELP/BOATWAR.WAV", "./aoe/HELP/BUTTON1.WAV", "./aoe/HELP/BUTTON2.WAV", "./aoe/HELP/BUTTON4.WAV", "./aoe/HELP/CATAPULT.WAV", "./aoe/HELP/CAV1.WAV", "./aoe/HELP/DOCK.WAV", "./aoe/HELP/ELEPHANT.WAV", "./aoe/HELP/FARM.WAV", "./aoe/HELP/GOVCNTR.WAV", "./aoe/HELP/GRANARY.WAV", "./aoe/HELP/HOUSE.WAV", "./aoe/HELP/MARKET.WAV", "./aoe/HELP/MONUMENT.WAV", "./aoe/HELP/PIT.WAV", "./aoe/HELP/READY.WAV", "./aoe/HELP/RUDKEN.WAV", "./aoe/HELP/SEIGEWRK.WAV", "./aoe/HELP/STABLE.WAV", "./aoe/HELP/TEMPLE.WAV", "./aoe/HELP/TOWER.WAV", "./aoe/HELP/TWNCNTR.WAV", "./aoe/HELP/T_ACAD.BMP", "./aoe/HELP/T_ARCH.BMP", "./aoe/HELP/T_BARR.BMP", "./aoe/HELP/T_DOCK.BMP", "./aoe/HELP/T_FARM.BMP", "./aoe/HELP/T_GOVT.BMP", "./aoe/HELP/T_GRAN.BMP", "./aoe/HELP/T_HOUSE.BMP", "./aoe/HELP/T_MARK.BMP", "./aoe/HELP/T_PIT.BMP", "./aoe/HELP/T_SEIGE.BMP", "./aoe/HELP/T_STBL.BMP", "./aoe/HELP/T_TMPLE.BMP", "./aoe/HELP/T_TOWERS.BMP", "./aoe/HELP/T_TWNCTR.BMP", "./aoe/HELP/T_WALL.BMP", "./aoe/HELP/T_WOND.BMP", "./aoe/HELP/VILLAGER.WAV", "./aoe/HELP/WALL.WAV", "./aoe/LANGUAGE.DLL", "./aoe/LANGUA_1.DLL", "./aoe/LEARN/", "./aoe/LEARN/LEARN.TXT", "./aoe/MAPDEF_1.BMP", "./aoe/SAVEGAME/", "./aoe/SAVEGAME/SAVEGAME.TXT", "./aoe/SCENARIO/", "./aoe/SCENARIO/MU0815_1.SCN", "./aoe/SCENARIO/MU0A3A_1.SCN", "./aoe/SCENARIO/MU400F_1.SCN", "./aoe/SCENARIO/MU4021_1.SCN", "./aoe/SCENARIO/MU463C_1.SCN", "./aoe/SCENARIO/MU5799_1.SCN", "./aoe/SCENARIO/MU57C6_1.SCN", "./aoe/SCENARIO/MU5B51_1.SCN", "./aoe/SCENARIO/MU7536_1.SCN", "./aoe/SCENARIO/MU7556_1.SCN", "./aoe/SCENARIO/MU991B_1.SCN", "./aoe/SCENARIO/MU9B36_1.SCN", "./aoe/SCENARIO/MUA111_1.SCN", "./aoe/SCENARIO/MUC715_1.SCN", "./aoe/SCENARIO/MUCEC5_1.SCN", "./aoe/SCENARIO/MUCED5_1.SCN", "./aoe/SCENARIO/MUD91B_1.SCN", "./aoe/SCENARIO/MUDDC4_1.SCN", "./aoe/SCENARIO/MUF7E5_1.SCN", "./aoe/SCENARIO/MUF93A_1.SCN", "./aoe/SCENARIO/MULTIP_1.SCN", "./aoe/SCENARIO/MULTIP_2.SCN", "./aoe/SCENARIO/MULTIP_3.SCN", "./aoe/SCENARIO/MULTIP_4.SCN", "./aoe/SCENARIO/SCENARIO.INF", "./aoe/SOUND/", "./aoe/SOUND/BIRD.WAV", "./aoe/SOUND/BIRDS1.WAV", "./aoe/SOUND/DESERT1.WAV", "./aoe/SOUND/DESERT2.WAV", "./aoe/SOUND/DESERT3.WAV", "./aoe/SOUND/DESERT4.WAV", "./aoe/SOUND/FOREST1.WAV", "./aoe/SOUND/FOREST2.WAV", "./aoe/SOUND/FOREST3.WAV", "./aoe/SOUND/FOREST4.WAV", "./aoe/SOUND/GRASS2.WAV", "./aoe/SOUND/GRASS3.WAV", "./aoe/SOUND/LAKE1.WAV", "./aoe/SOUND/LOST.MID", "./aoe/SOUND/MUSIC1.MID", "./aoe/SOUND/MUSIC2.MID", "./aoe/SOUND/MUSIC3.MID", "./aoe/SOUND/MUSIC4.MID", "./aoe/SOUND/MUSIC5.MID", "./aoe/SOUND/MUSIC6.MID", "./aoe/SOUND/MUSIC7.MID", "./aoe/SOUND/MUSIC8.MID", "./aoe/SOUND/MUSIC9.MID", "./aoe/SOUND/OCEAN1.WAV", "./aoe/SOUND/OCEAN2.WAV", "./aoe/SOUND/OCEAN3.WAV", "./aoe/SOUND/OCEAN4.WAV", "./aoe/SOUND/OCEAN5.WAV", "./aoe/SOUND/OPEN.MID", "./aoe/SOUND/STREAM2.WAV", "./aoe/SOUND/TAUNT001.WAV", "./aoe/SOUND/TAUNT002.WAV", "./aoe/SOUND/TAUNT003.WAV", "./aoe/SOUND/TAUNT004.WAV", "./aoe/SOUND/TAUNT005.WAV", "./aoe/SOUND/TAUNT006.WAV", "./aoe/SOUND/TAUNT007.WAV", "./aoe/SOUND/TAUNT008.WAV", "./aoe/SOUND/TAUNT009.WAV", "./aoe/SOUND/TAUNT010.WAV", "./aoe/SOUND/TAUNT011.WAV", "./aoe/SOUND/TAUNT012.WAV", "./aoe/SOUND/TAUNT013.WAV", "./aoe/SOUND/TAUNT014.WAV", "./aoe/SOUND/TAUNT015.WAV", "./aoe/SOUND/TAUNT016.WAV", "./aoe/SOUND/TAUNT017.WAV", "./aoe/SOUND/TAUNT018.WAV", "./aoe/SOUND/TAUNT019.WAV", "./aoe/SOUND/TAUNT020.WAV", "./aoe/SOUND/TAUNT021.WAV", "./aoe/SOUND/TAUNT022.WAV", "./aoe/SOUND/TAUNT023.WAV", "./aoe/SOUND/TAUNT024.WAV", "./aoe/SOUND/TAUNT025.WAV", "./aoe/SOUND/WIND1.WAV", "./aoe/SOUND/WIND2.WAV", "./aoe/SOUND/WON.MID", "./aoe/SOUND/XLOST.MID", "./aoe/SOUND/XMUSIC1.MID", "./aoe/SOUND/XMUSIC10.MID", "./aoe/SOUND/XMUSIC2.MID", "./aoe/SOUND/XMUSIC3.MID", "./aoe/SOUND/XMUSIC4.MID", "./aoe/SOUND/XMUSIC5.MID", "./aoe/SOUND/XMUSIC6.MID", "./aoe/SOUND/XMUSIC7.MID", "./aoe/SOUND/XMUSIC8.MID", "./aoe/SOUND/XMUSIC9.MID", "./aoe/SOUND/XOPEN.MID", "./aoe/SOUND/XWON.MID", "./aoe/game0.nfo" ];

  
  zip = new JSZip();
  zipFilename = disk + ".zip";
  for (let i = 0; i < allfiles.length; i++) {
    const path = allfiles[i].replaceAll("./", "");
    const isDirectory = (path.charAt(path.length-1) == "/");
    console.log("Zipping: " + path + " dir: " + isDirectory);
    if (isDirectory) {
      zip.folder(path);
    } else {
      zip.file(path, await readFile(path));
    }
  }

  await genAndDownloadZip();
}

async function genAndDownloadZip() {
  return new Promise(async (resolve) => {
    console.log(`Finalising ${zipFilename}...`);
    const zipData = await zip.generateAsync({type : "uint8array"});
    console.log(`Downloading ${zipFilename}...`);
    downloadFile(zipFilename, zipData);
    resolve();
  })
}

async function exportWalkdata() {
  return new Promise(async (resolve) => {
    if (allfiles == null || allfiles.length == 0) {
      console.log("Can't export empty walkdata");
      return;
    }

    console.log("Compressing...");
    zip = new JSZip();
    zip.file("walkdata.json", JSON.stringify({files: allfiles}));
    const zipData = await zip.generateAsync({type: "uint8array"});
    downloadFile(diskIdInput.value + ".walkdata", zipData);
    resolve();
  });
}

async function importWalkdata() {
  importFileUploadInput.onchange = function() {
    if (importFileUploadInput.files.length == 0) {
      console.log("No walkdata file selected");
      return;
    }
    console.log("Uploading file");

    const reader = new FileReader();

    reader.onload = async () => {
      console.log("Uploaded. Decompressing");
      const uint8Array = new Uint8Array(reader.result);

      const uploadZip = await JSZip.loadAsync(uint8Array);
      const content = JSON.parse(await uploadZip.file("walkdata.json").async("string"));
      allfiles = content.files;
      console.log("Finished loading");
    };

    reader.onerror = (error) => {
      console.error('Error reading file:' + error.toString());
    };

    reader.readAsArrayBuffer(importFileUploadInput.files[0]);
  }

  importFileUploadInput.click();
}

exportWalkButton.onclick = function() {
  exportWalkdata();
}
importWalkButton.onclick = function() {
  importWalkdata();
}
cancelButton.onclick = async function() {
  genAndDownloadZip();
}
skipButton.onclick = function() {
  skip = true;
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}


async function readFile(path) {
  return new Promise(async (resolve) => {
    let progressAmount = 0;
    let progressPrinted = 0;
    let dataArray = new Uint8Array();
    const stats = await filesystem.fs.stat(path);
    if (stats.isDirectory()) return;
    const filesize = stats.size;
    const printSize = formatBytes(filesize) + " ";
    console.log(printSize);
    const readStream = filesystem.fs.fs.createReadStream(path, { highWaterMark: 512 });
    const totalBarLength = (logArea.cols - printSize.length);

    readStream.on('data', (chunk) => {
      if (skip) {
        skip = false;
        console.log("");
        console.log("");
        console.log("");
        resolve(dataArray);
        return;
      }
      dataArray = new Uint8Array([...dataArray, ...chunk]);
      progressAmount = Math.min((dataArray.length / filesize) * totalBarLength, totalBarLength);
      logArea.value = logArea.value.slice(0, -1);
      while (Math.floor(progressAmount) > progressPrinted) {
        logArea.value += "=";
        progressPrinted++;
      }
      logArea.value += ">"
    });

    readStream.on('end', () => {
      logArea.value = logArea.value.slice(0, -1);
      logArea.value += "=";
      console.log("\nFinished reading " + path);
      resolve(dataArray);
    });

    readStream.on('error', (err) => {
      console.log("Error reading " + path + " " + err.toString());
    });


    // filesystem.fs.fs.readFile(path, {flag: "r", encoding: null}, (err, data) => {
    //   if (err) {
    //     console.error("Error reading file!!!!");
    //   }
    //   resolve(data);
    // });
  });
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
    //resolve((await filesystem.fs.stat(path)).isDirectory()); // Slow af
    const pathPieces = path.split("/"); // Guessing
    const filename = pathPieces[pathPieces.length-1];
    let isDir = !filename.includes(".");
    console.log(isDir);
    if (filename.charAt(0) == ".") {
      isDir = true;
    }
    resolve(isDir);
  });
}

startButton.onclick = function() {
  SockDriveFileSystem(diskOwnerInput.value, diskIdInput.value);
}

walkButton.onclick = function() {
  SockDriveFileSystem(diskOwnerInput.value, diskIdInput.value, "", true);
}


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
    console.log("Image size: " + imageSize + template.size);
    console.log("Sector size: " + sectorSize + template.sector_size);
    console.log("Readonly: "+ !write);
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
  const blob = new Blob([data], { type: "application/zip" });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


//DriveCopy("dos.zone", "aoe_d");

