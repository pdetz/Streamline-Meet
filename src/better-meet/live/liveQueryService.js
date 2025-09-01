export async function subscribeToQuery(query, callbacks) {
    console.log('Subscribing to query:', query);
    try {
        let subscription = await query.subscribe();

        for (const [event, callback] of Object.entries(callbacks)) {
            if (typeof callback === 'function') {
                subscription.on(event, (object) => {
                    callback(object.toJSON());
                });
            } else {
                console.warn(`Callback for event "${event}" is not a function and will be ignored.`);
            }
        }

        return subscription;

    } catch (error) {
        console.error('Live Query subscription failed:', error);
        return null;
    }
}