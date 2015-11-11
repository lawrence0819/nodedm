var index_1 = require('../index');
var chai = require('chai');
var chai_1 = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
describe('DockerMachine', function () {
    describe('#create', function () {
        it('should create 4 virtualbox VM and named vbox0, vbox1, vbox2, vbox3', function (done) {
            var vboxDriver = new index_1.Driver();
            vboxDriver.name = 'virtualbox';
            vboxDriver.options['virtualbox-memory'] = '512';
            chai_1.expect(index_1.dm.create(['vbox0', 'vbox1', 'vbox2', 'vbox3'], vboxDriver))
                .to.eventually.deep.equal([true, true, true, true]).notify(done);
        });
    });
    describe('#list', function () {
        it('should return list of machine', function (done) { return chai_1.expect(index_1.dm.list())
            .to.eventually.deep.property('[0].name', 'vbox0').notify(done); });
    });
    describe('#inspect', function () {
        it('should return vbox0 inspect object', function (done) { return chai_1.expect(index_1.dm.inspect('vbox0'))
            .to.eventually.property('DriverName', 'virtualbox').notify(done); });
    });
    describe('#ip', function () {
        it('should return vbox0 ip', function (done) { return chai_1.expect(index_1.dm.ip('vbox0'))
            .to.eventually.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/ig).notify(done); });
    });
    describe('#url', function () {
        it('should return vbox0 url', function (done) { return chai_1.expect(index_1.dm.url('vbox0'))
            .to.eventually.match(/^tcp:\/\/(?:[0-9]{1,3}\.){3}[0-9]{1,3}:[0-9]+$/ig).notify(done); });
    });
    describe('#upgrade', function () {
        it('should upgrade vbox0', function (done) { return chai_1.expect(index_1.dm.upgrade('vbox0')).to.eventually.equal(true).notify(done); });
    });
    describe('#regenerateCert', function () {
        it('should regenerate cert for vbox0', function (done) { return chai_1.expect(index_1.dm.regenerateCert('vbox0')).to.eventually.equal(true).notify(done); });
    });
    describe('#stop', function () {
        it('should stop vbox1', function (done) { return chai_1.expect(index_1.dm.stop('vbox1'))
            .to.eventually.equal(true).notify(done); });
        it('should stop vbox2', function (done) { return chai_1.expect(index_1.dm.stop('vbox2'))
            .to.eventually.equal(true).notify(done); });
        it('should stop vbox3', function (done) { return chai_1.expect(index_1.dm.stop('vbox3'))
            .to.eventually.equal(true).notify(done); });
    });
    describe('#remove', function () {
        it('should remove vbox3', function (done) { return chai_1.expect(index_1.dm.remove('vbox3'))
            .to.eventually.equal(true).notify(done); });
    });
    describe('#start', function () {
        it('should start vbox2', function (done) { return chai_1.expect(index_1.dm.start('vbox2'))
            .to.eventually.equal(true).notify(done); });
    });
    describe('#status', function () {
        it('should return running status when name is vbox0', function (done) { return chai_1.expect(index_1.dm.status('vbox0'))
            .to.eventually.equal(index_1.MachineStatus.RUNNING).notify(done); });
        it('should return stopped status when name is vbox1', function (done) { return chai_1.expect(index_1.dm.status('vbox1'))
            .to.eventually.equal(index_1.MachineStatus.STOPPED).notify(done); });
        it('should return running status when name is vbox2', function (done) { return chai_1.expect(index_1.dm.status('vbox2'))
            .to.eventually.equal(index_1.MachineStatus.RUNNING).notify(done); });
        it('should return not exist status when name is vbox3', function (done) { return chai_1.expect(index_1.dm.status('vbox3'))
            .to.eventually.equal(index_1.MachineStatus.NOT_EXIST).notify(done); });
    });
    describe('#kill', function () {
        it('should kill vbox0, vbox1, vbox2', function (done) { return chai_1.expect(index_1.dm.kill(['vbox0', 'vbox1', 'vbox2']))
            .to.eventually.deep.equal([true, true, true]).notify(done); });
    });
    describe('#remove', function () {
        it('should remove vbox0, vbox1, vbox2', function (done) { return chai_1.expect(index_1.dm.remove(['vbox0', 'vbox1', 'vbox2']))
            .to.eventually.deep.equal([true, true, true]).notify(done); });
    });
    describe('#create swarm', function () {
        it('should create 4 virtualbox VM and named vbox0, vbox1, vbox2, vbox3 with swarm', function (done) {
            var vboxDriver = new index_1.Driver();
            var swarm = new index_1.Swarm();
            vboxDriver.name = 'virtualbox';
            vboxDriver.options['virtualbox-memory'] = '512';
            swarm.master = true;
            swarm.discovery = 'token://1234';
            chai_1.expect(index_1.dm.create(['vbox0'], vboxDriver, swarm))
                .to.eventually.deep.equal([true]);
            swarm.master = false;
            chai_1.expect(index_1.dm.create(['vbox1', 'vbox2', 'vbox3'], vboxDriver, swarm))
                .to.eventually.deep.equal([true, true, true]).notify(done);
        });
    });
    describe('#swarm list', function () {
        it('should return docker machine list', function (done) { return chai_1.expect(index_1.dm.list())
            .to.eventually.deep.property('[1].swarm', 'vbox0').notify(done); });
    });
    describe('#killAll', function () {
        it('should kill all vbox', function (done) { return chai_1.expect(index_1.dm.killAll())
            .to.eventually.deep.equal([true, true, true, true]).notify(done); });
    });
    describe('#removeAll', function () {
        it('should remove all vbox', function (done) { return chai_1.expect(index_1.dm.removeAll())
            .to.eventually.deep.equal([true, true, true, true]).notify(done); });
    });
});
