var opine = require('gulp-opine')
var s3 = require('s3');

var sync = opine.module('sync');
var source = sync.getConfig('source', 'public');
var creds = sync.getConfig('creds', {
    accessKeyId: process.env.MCLEAN_S3,
    secretAccessKey: process.env.MCLEAN_S3_KEY,
    region: 'ap-southeast-2'
});
var bucket = sync.getConfig('bucket', 'tommclean.com');
var dest = sync.getConfig('dest', source);
var live = sync.getConfig('live', false);
var deleteRemoved = sync.getConfig('deleteRemoved', false);

if(live) {
    sync.addWatch(source + '/**/*');
}

var client = s3.createClient({ s3Options: creds }); 

sync.task(done => {
    var uploader = client.uploadDir({
        localDir: source,
        deleteRemoved: deleteRemoved,
        s3Params: {
            ACL: 'public-read',
            Bucket: bucket,
            Prefix: dest
        }
    });

    uploader.on('end', done);
    uploader.on('error', e => {
        console.log(e);
    });
});

