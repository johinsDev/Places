import kue from 'kue';
import Place from '../models/place.model';

const jobs = kue.createQueue();
const jobName = 'uploadImage';

export const handle = jobs.process(jobName, async ({ data }, done) => {
  const place = await Place.findById(data.place.id);
  for (const file in data.files) {
    const path = data.files[file][0].path;
    await place.uploadImage(path, file);
  }
  done();
});

export const dispatch = params => {
  jobs.create(jobName, params).save()
};

export default { dispatch, handle };
