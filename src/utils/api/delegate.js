import { requestActivePeer } from './peers';

export const listAccountDelegates = (activePeer, address) =>
  requestActivePeer(activePeer, 'accounts/delegates', { address });


export const listDelegates = (activePeer, options) =>
  requestActivePeer(activePeer, `delegates/${options.q ? 'search' : ''}`, options);

export const getDelegate = (activePeer, options) =>
  requestActivePeer(activePeer, 'delegates/get', options);

export const vote = (activePeer, secret, publicKey, voteList, unvoteList, secondSecret = null) =>
  requestActivePeer(activePeer, 'accounts/delegates', {
    secret,
    publicKey,
    delegates: voteList.map(delegate => `+${delegate.publicKey}`).concat(
      unvoteList.map(delegate => `-${delegate.publicKey}`),
    ),
    secondSecret,
  });

export const voteAutocomplete = (username, votedDict) => {
  const options = { q: username };

  return new Promise((resolve, reject) =>
    listDelegates(options)
    .then((response) => {
      resolve(response.delegates.filter(d => !votedDict[d.username]));
    })
    .catch(reject),
  );
};

export const unvoteAutocomplete = (username, votedList) =>
  new Promise((resolve) => {
    resolve(votedList.filter(delegate => delegate.username.indexOf(username) !== -1));
  });

export const registerDelegate = (activePeer, username, secret, secondSecret = null) => {
  const data = { username, secret };
  if (secondSecret) {
    data.secondSecret = secondSecret;
  }
  return requestActivePeer(activePeer, 'delegates', data);
};