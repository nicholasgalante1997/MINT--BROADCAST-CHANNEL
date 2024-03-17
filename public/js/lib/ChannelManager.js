import Id from './Id.js';
import logger from './Logger.js';

class ChannelManager {
    /**
     * @readonly
     * @type {string}
     */
    id;
    /**
     * @type {Map<string, BroadcastChannel>}
     */
    joined;
    
    constructor(){
        this.joined = new Map();
        this.id = Id.getId();
    }

    join(channel) {
        logger.info("ChannelManager is joining " + channel);

        if (this.joined.has(channel)) {
            logger.warn("Already subscribed to this channel.");
            return this.joined.get(channel);
        }

        let bc = new BroadcastChannel(channel);
        this.joined.set(channel, bc);
        return bc;
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