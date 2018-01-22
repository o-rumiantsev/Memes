'use strict';

const  calculate = (user, memesInfo)  => {
  const empty = { lulz: 0, views: 0, rating: 0 };

  const lulzier = memesInfo.filter(lul => lul.clicked);
  const danker = memesInfo.filter(lul => !lul.clicked);

  let lulzierMeme = user.memes.filter(meme => (meme._id === lulzier._id));
  let dankerMeme = user.memes.filter(meme => (meme._id === danker._id));

  lulzierMeme = lulzierMeme[0] || Object.assign(empty, { _id: lulzier._id });
  dankerMeme = dankerMeme[0] || Object.assign(empty, { _id: danker._id });

  lulzierMeme.views++;
  lulzierMeme.lulz += dankerMeme.lulz + 1;
  lulzierMeme.rating = lulzierMeme.lulz / lulzierMeme.views;

  dankerMeme.views++;
  dankerMeme.rating = dankerMeme.lulz / dankerMeme.views;

  return [ lulzierMeme, dankerMeme ];
};

const updateForUser = (user, newMemes) => {
  const memes = user.memes.map(meme => {
    for (const i in newMemes) {
      if (meme._id === newMemes[i]._id) return newMemes[i];
    }
    return meme;
  });

  return { $set: { memes } };
};

const getUserMemes = (user, memesInfo) => {
  const memes = user.memes.filter(meme => {
    for (const i in memesInfo) {
      if (meme._id === memesInfo[i]._id) return true;
    }
    return false;
  });
  const memesById = {};
  memes.forEach(meme => {
    const id = meme._id;
    delete meme._id;
    memesById[id] = meme;
  });

  return memesById;
};

const updateTotal = (meme, deltaRating, newUser = false) => {
  const data = {};

  data.usersWatched = meme.usersWatched + (newUser ? 1 : 0);
  data.rating = meme.rating + deltaRating / data.usersWatched;

  return { $set: data };
};

module.exports = {
  calculate,
  updateForUser,
  getUserMemes,
  updateTotal
};
