exports.seed = function(knex, Promise) {
  return knex('items').del()
  .then(() => {
    return Promise.all([
      knex('items').insert({
        id: 1,
        name: 'baseball bat',
        reason: 'nostalgia',
        cleanliness: 'dusty',
        created_at: new Date
      }),
      knex('items').insert({
        id: 2,
        name: 'rockies hat',
        reason: 'the rockies are awesome',
        cleanliness: 'sparkling',
        created_at: new Date
      }),
      knex('items').insert({
        id: 3,
        name: 'mgmt t-shirt',
        reason: 'indie rock is important',
        cleanliness: 'rancid',
        created_at: new Date
      }),
      knex('items').insert({
        id: 4,
        name: 'tight jeans',
        reason: 'to remind me how dumb I was',
        cleanliness: 'rancid',
        created_at: new Date
      }),
      knex('items').insert({
        id: 5,
        name: 'tebow jersey',
        reason: 'not too sure why, maybe jesus',
        cleanliness: 'sparkling',
        created_at: new Date
      }),
    ]);
  });
};
