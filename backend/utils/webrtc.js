const crypto = require('crypto');

class WebRTCUtils {
  static generateEncryptionKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  static validateOffer(offer) {
    if (!offer || typeof offer !== 'object') {
      throw new Error('Invalid WebRTC offer');
    }

    if (!offer.type || !offer.sdp) {
      throw new Error('WebRTC offer must have type and sdp properties');
    }

    if (offer.type !== 'offer') {
      throw new Error('WebRTC offer type must be "offer"');
    }

    return true;
  }

  static validateAnswer(answer) {
    if (!answer || typeof answer !== 'object') {
      throw new Error('Invalid WebRTC answer');
    }

    if (!answer.type || !answer.sdp) {
      throw new Error('WebRTC answer must have type and sdp properties');
    }

    if (answer.type !== 'answer') {
      throw new Error('WebRTC answer type must be "answer"');
    }

    return true;
  }

  static validateIceCandidate(candidate) {
    if (!candidate || typeof candidate !== 'object') {
      throw new Error('Invalid ICE candidate');
    }

    if (!candidate.candidate || !candidate.sdpMid || candidate.sdpMLineIndex === undefined) {
      throw new Error('ICE candidate must have candidate, sdpMid, and sdpMLineIndex properties');
    }

    return true;
  }
}

module.exports = WebRTCUtils;