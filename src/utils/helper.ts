function createUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const getSessionId = () => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = createUUID();
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};


export default getSessionId;
