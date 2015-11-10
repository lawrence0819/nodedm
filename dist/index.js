var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var child_process = require('child_process');
var es6_promise_1 = require('es6-promise');
var AbstractDriver = (function () {
    function AbstractDriver(name, options) {
        var _this = this;
        this.name = name;
        this.options = {};
        this.values = {};
        options.forEach(function (opnion) { return _this.options[opnion.name] = opnion; });
    }
    AbstractDriver.prototype.getName = function () {
        return this.name;
    };
    AbstractDriver.prototype.setOptionValue = function (optionName, optionValue) {
        this.values[optionName] = optionValue;
    };
    AbstractDriver.prototype.toCommandOptions = function () {
        var optionValues = ['-d', this.name];
        for (var name_1 in this.options) {
            var option = this.options[name_1];
            var value = this.values[name_1];
            if (option.required && value === null) {
                throw new Error('Option: ' + option.name + ' required');
            }
            if (option.hasOwnProperty('pattern') && !!value && !option.pattern.test(value)) {
                throw new Error('Option: ' + option.name + ' pattern: ' + option.pattern.toString() + ' not match');
            }
        }
        for (var name_2 in this.values) {
            var value = this.values[name_2];
            optionValues.push('--' + name_2);
            optionValues.push(value);
        }
        return optionValues;
    };
    return AbstractDriver;
})();
exports.AbstractDriver = AbstractDriver;
var VirtualBoxDriver = (function (_super) {
    __extends(VirtualBoxDriver, _super);
    function VirtualBoxDriver() {
        _super.call(this, 'virtualbox', [
            VirtualBoxDriver.OPTION_MEMORY,
            VirtualBoxDriver.OPTION_CPU_COUNT,
            VirtualBoxDriver.OPTION_DISK_SIZE,
            VirtualBoxDriver.OPTION_BOOT_2_DOCKER_RUL,
            VirtualBoxDriver.OPTION_IMPORT_BOOT_2_DOCKER_VM,
            VirtualBoxDriver.OPTION_HOSTONLY_CIDR,
            VirtualBoxDriver.OPTION_HOSTONLY_NICTYPE,
            VirtualBoxDriver.OPTION_HOSTONLY_NICPROMISC,
            VirtualBoxDriver.OPTION_NO_SHARE,
        ]);
    }
    VirtualBoxDriver.OPTION_MEMORY = {
        name: 'virtualbox-memory',
        required: false,
        pattern: /[0-9]+/
    };
    VirtualBoxDriver.OPTION_CPU_COUNT = {
        name: 'virtualbox-cpu-count',
        required: false,
        pattern: /[0-9]+/
    };
    VirtualBoxDriver.OPTION_DISK_SIZE = {
        name: 'virtualbox-disk-size',
        required: false,
        pattern: /[0-9]+/
    };
    VirtualBoxDriver.OPTION_BOOT_2_DOCKER_RUL = {
        name: 'virtualbox-boot2docker-url',
        required: false
    };
    VirtualBoxDriver.OPTION_IMPORT_BOOT_2_DOCKER_VM = {
        name: 'virtualbox-import-boot2docker-vm',
        required: false
    };
    VirtualBoxDriver.OPTION_HOSTONLY_CIDR = {
        name: 'virtualbox-hostonly-cidr',
        required: false
    };
    VirtualBoxDriver.OPTION_HOSTONLY_NICTYPE = {
        name: 'virtualbox-hostonly-nictype',
        required: false
    };
    VirtualBoxDriver.OPTION_HOSTONLY_NICPROMISC = {
        name: 'virtualbox-hostonly-nicpromisc',
        required: false
    };
    VirtualBoxDriver.OPTION_NO_SHARE = {
        name: 'virtualbox-no-share',
        required: false
    };
    return VirtualBoxDriver;
})(AbstractDriver);
exports.VirtualBoxDriver = VirtualBoxDriver;
var GenericDriver = (function (_super) {
    __extends(GenericDriver, _super);
    function GenericDriver() {
        _super.call(this, 'virtualbox', [
            GenericDriver.OPTION_IP_ADDRESS,
            GenericDriver.OPTION_SSH_USER,
            GenericDriver.OPTION_SSH_KEY,
            GenericDriver.OPTION_SSH_PORT
        ]);
    }
    GenericDriver.OPTION_IP_ADDRESS = {
        name: 'generic-ip-address',
        required: true,
        pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
    };
    GenericDriver.OPTION_SSH_USER = {
        name: 'generic-ssh-user',
        required: false,
    };
    GenericDriver.OPTION_SSH_KEY = {
        name: 'generic-ssh-key',
        required: false,
    };
    GenericDriver.OPTION_SSH_PORT = {
        name: 'generic-ssh-port',
        required: false,
    };
    return GenericDriver;
})(AbstractDriver);
exports.GenericDriver = GenericDriver;
var Swarm = (function () {
    function Swarm() {
        this.master = false;
        this.opts = [];
    }
    Swarm.prototype.addOpt = function (value) {
        this.opts.push(value);
    };
    Swarm.prototype.toCommandOptions = function () {
        var options = ['--swarm'];
        if (this.master) {
            options.push('--swarm-master');
        }
        this._push(options, 'swarm-discovery', this.discovery, function (name) {
            throw new Error('Swarm discovery option cannot be empty');
        });
        this._push(options, 'swarm-strategy', this.strategy);
        this._push(options, 'swarm-host', this.host);
        this._push(options, 'swarm-addr', this.addr);
        this._push(options, 'swarm-strategy', this.strategy);
        for (var _i = 0, _a = this.opts; _i < _a.length; _i++) {
            var opt = _a[_i];
            this._push(options, 'swarm-opt', opt);
        }
        return options;
    };
    Swarm.prototype._push = function (options, name, value, emptyCallback) {
        if (value) {
            options.push('--' + name);
            options.push(value);
        }
        else if (emptyCallback) {
            emptyCallback(name);
        }
    };
    return Swarm;
})();
exports.Swarm = Swarm;
var MachineStatus = (function () {
    function MachineStatus(value) {
        this.value = value;
    }
    MachineStatus.valueOf = function (state) {
        for (var _i = 0, _a = MachineStatus.ALL; _i < _a.length; _i++) {
            var status_1 = _a[_i];
            if (state.toLowerCase() === status_1.value.toLowerCase()) {
                return status_1;
            }
        }
        return MachineStatus.NOT_EXIST;
    };
    MachineStatus.STOPPED = new MachineStatus('Stopped');
    MachineStatus.RUNNING = new MachineStatus('Running');
    MachineStatus.TIMEOUT = new MachineStatus('Timeout');
    MachineStatus.ERROR = new MachineStatus('Error');
    MachineStatus.NOT_EXIST = new MachineStatus('Not Exist');
    MachineStatus.ALL = [
        MachineStatus.STOPPED,
        MachineStatus.RUNNING,
        MachineStatus.TIMEOUT,
        MachineStatus.ERROR,
        MachineStatus.NOT_EXIST];
    return MachineStatus;
})();
exports.MachineStatus = MachineStatus;
var DockerMachine = (function () {
    function DockerMachine() {
    }
    DockerMachine.prototype.list = function () {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this._exec(['ls']).then(function (out) {
                var lines = out.split('\n'), nameIndex = lines[0].indexOf('NAME'), activeIndex = lines[0].indexOf('ACTIVE'), driverIndex = lines[0].indexOf('DRIVER'), stateIndex = lines[0].indexOf('STATE'), urlIndex = lines[0].indexOf('URL'), swarmIndex = lines[0].indexOf('SWARM'), machines = [];
                for (var i = 1; i < lines.length; i++) {
                    var line = lines[i];
                    if (line === null || line === '') {
                        break;
                    }
                    machines.push({
                        name: line.substring(nameIndex, activeIndex - 1).trim(),
                        active: line.substring(activeIndex, driverIndex - 1).trim() === '*',
                        driver: line.substring(activeIndex, stateIndex - 1).trim(),
                        state: MachineStatus.valueOf(line.substring(stateIndex, urlIndex - 1).trim()),
                        url: line.substring(urlIndex, swarmIndex - 1).trim(),
                        swarm: line.substring(swarmIndex).trim()
                    });
                }
                resolve(machines);
            }).catch(function (out) { return reject(out); });
        });
    };
    ;
    DockerMachine.prototype.create = function (names, driver, swarm) {
        var _this = this;
        var fn = function (name) {
            var options = ['create', name].concat(driver.toCommandOptions());
            if (swarm) {
                options = options.concat(swarm.toCommandOptions());
            }
            return _this._bexec(options);
        };
        return this._namesExec(names, fn);
    };
    DockerMachine.prototype.inspect = function (names) {
        var _this = this;
        var fn = function (name) { return _this._exec(['inspect', name]).then(function (out) { return JSON.parse(out); }); };
        return this._namesExec(names, fn);
    };
    DockerMachine.prototype.inspectAll = function () {
        return this._listExec(this.inspect);
    };
    DockerMachine.prototype.remove = function (names) {
        var _this = this;
        var fn = function (name) { return _this._bexec(['rm', name]); };
        return this._namesExec(names, fn);
    };
    DockerMachine.prototype.removeAll = function () {
        return this._listExec(this.remove);
    };
    DockerMachine.prototype.start = function (names) {
        var _this = this;
        var fn = function (name) { return _this._bexec(['start', name]); };
        return this._namesExec(names, fn);
    };
    DockerMachine.prototype.startAll = function () {
        return this._listExec(this.start);
    };
    DockerMachine.prototype.stop = function (names) {
        var _this = this;
        var fn = function (name) { return _this._bexec(['stop', name]); };
        return this._namesExec(names, fn);
    };
    DockerMachine.prototype.stopAll = function () {
        return this._listExec(this.stop);
    };
    DockerMachine.prototype.restart = function (names) {
        var _this = this;
        var fn = function (name) { return _this._bexec(['restart', name]); };
        return this._namesExec(names, fn);
    };
    DockerMachine.prototype.restartAll = function () {
        return this._listExec(this.restart);
    };
    DockerMachine.prototype.kill = function (names) {
        var _this = this;
        var fn = function (name) { return _this._bexec(['kill', name]); };
        return this._namesExec(names, fn);
    };
    DockerMachine.prototype.killAll = function () {
        return this._listExec(this.kill);
    };
    DockerMachine.prototype.status = function (names) {
        var _this = this;
        var fn = function (name) {
            return new es6_promise_1.Promise(function (resolve, reject) {
                _this._exec(['status', name]).then(function (out) {
                    resolve(MachineStatus.valueOf(out));
                }).catch(function (out) {
                    if (/not exist/ig.test(out)) {
                        resolve(MachineStatus.NOT_EXIST);
                    }
                    else {
                        reject(out);
                    }
                });
            });
        };
        return this._namesExec(names, fn);
    };
    ;
    DockerMachine.prototype.statusAll = function () {
        return this._listExec(this.status);
    };
    DockerMachine.prototype.ip = function (names) {
        var _this = this;
        var fn = function (name) { return _this._exec(['ip', name]); };
        return this._namesExec(names, fn);
    };
    DockerMachine.prototype.ipAll = function () {
        return this._listExec(this.ip);
    };
    DockerMachine.prototype.url = function (names) {
        var _this = this;
        var fn = function (name) { return _this._exec(['url', name]); };
        return this._namesExec(names, fn);
    };
    DockerMachine.prototype.urlAll = function () {
        return this._listExec(this.url);
    };
    DockerMachine.prototype.upgrade = function (names) {
        var _this = this;
        var fn = function (name) { return _this._bexec(['upgrade', name]); };
        return this._namesExec(names, fn);
    };
    DockerMachine.prototype.upgradeAll = function () {
        return this._listExec(this.upgrade);
    };
    DockerMachine.prototype.regenerateCert = function (names) {
        var _this = this;
        var fn = function (name) { return _this._bexec(['regenerate-certs', '-f', name]); };
        return this._namesExec(names, fn);
    };
    DockerMachine.prototype.regenerateAllCert = function () {
        return this._listExec(this.regenerateCert);
    };
    DockerMachine.prototype._namesExec = function (names, fn) {
        return Array.isArray(names) ? this._batchExec(names, fn) : fn(names);
    };
    DockerMachine.prototype._listExec = function (fn) {
        var _this = this;
        return _this.list().then(function (machines) {
            var names = machines.map(function (machine) { return machine.name; });
            return _this._batchExec(names, fn);
        });
    };
    DockerMachine.prototype._batchExec = function (names, fn) {
        var _this = this;
        var promises = [];
        names.forEach(function (name) { return promises.push(fn.apply(_this, [name])); });
        return es6_promise_1.Promise.all(promises);
    };
    DockerMachine.prototype._bexec = function (command) {
        return this._exec(command).then(function (out) { return true; });
    };
    DockerMachine.prototype._exec = function (command) {
        var fullCommand = command.slice();
        fullCommand.unshift('docker-machine');
        return new es6_promise_1.Promise(function (resolve, reject) {
            child_process.exec(fullCommand.join(' '), function (error, stdout, stderr) {
                if (error) {
                    reject(stderr.toString().trim());
                }
                else {
                    resolve(stdout.toString().trim());
                }
            });
        });
    };
    ;
    return DockerMachine;
})();
exports.DockerMachine = DockerMachine;
;
exports.dm = new DockerMachine();
