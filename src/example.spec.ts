class FriendsList {
    friends = [];

    addFriend(name) {
        this.friends.push(name);
        this.announceFriendship(name);
    }

    announceFriendship(name) {
        global.console.log(`${name} is now a friend`);
    }

    removeFriend(name) {
        const idx = this.friends.indexOf(name);

        if (idx === -1) {
            throw new Error('Friend not found');
        }

        this.friends.splice(idx, 1);
    }
}

describe('FriendsList', () => {
    let friendsList;

    beforeEach(() => {
        friendsList = new FriendsList();
    });

    afterEach(() => {});

    it('Initializes friensds list', () => {
        expect(friendsList.friends.length).toEqual(0);
    });

    it('Adds friends to the list', () => {
        friendsList.addFriend('maks');

        expect(friendsList.friends.length).toEqual(1);
    });

    it('Announce friendship', () => {
        friendsList.announceFriendship = jest.fn();

        expect(friendsList.announceFriendship).not.toHaveBeenCalled();

        const friendName = 'myFriend';
        friendsList.addFriend(friendName);
        expect(friendsList.announceFriendship).toHaveBeenCalled(); //toHaveBeenCalledTimes(1);
        expect(friendsList.announceFriendship).toHaveBeenCalledWith(friendName);
    });

    describe('Remove friend', () => {
        it('Removes a friend from the list', () => {
            const friendName = 'testName';
            friendsList.addFriend(friendName);

            expect(friendsList.friends[0]).toEqual(friendName);

            friendsList.removeFriend(friendName);

            expect(friendsList.friends[0]).toBeUndefined();
        });

        it('Throws error as friend does not exist', () => {
            expect( () => friendsList.removeFriend('Unknown Friend')).toThrow(new Error('Friend not found'));//toThrow();
        });
    });
});
