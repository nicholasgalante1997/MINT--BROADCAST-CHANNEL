import Id from './Id.js';
import logger from './Logger.js';

class ChannelManager {
    id;
    joined;
    constructor(){
        this.joined = new Map();
        this.id = Id.getId();
    }

    join(channel) {
        logger.info("ChannelManager is joining " + channel);
        this.joined.set(channel, new BroadcastChannel(channel));
    }

    getChannel(channel) {
        return this.joined.get(channel);
    }

    leave(channel) {
        logger.warn("ChannelManager is leaving " + channel);
        return this.joined.delete(channel);
    }

    pollJoined() {
        return this.joined.size;
    }
}

export default ChannelManager;