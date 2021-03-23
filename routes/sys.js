const router = require("express").Router();
const os = require("os");

router.get("/", (req, res) => {
  res.end(
    `CPUs : ${os.cpus()[0].model}, Freemem : ${
      os.freemem / 1000000000
    } GB, Total Mem : ${os.totalmem / 1000000000} GB, Uptime : ${
      os.uptime / 3600
    } Hrs, Version : ${os.version}`
  );
});

module.exports = router;
