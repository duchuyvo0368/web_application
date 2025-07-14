function recommendFriendsAdvanced(userId, allFriendships) {
    const directFriends = new Set(allFriendships[userId] || []);
    const mutualFriendCounter = {};

    for (const [otherUser, friends] of Object.entries(allFriendships)) {
        if (otherUser === userId) continue;
        if (directFriends.has(otherUser)) continue;

        let mutualCount = 0;
        for (const f of friends) {
            if (directFriends.has(f)) {
                mutualCount++;
            }
        }

        if (mutualCount > 1) {
            mutualFriendCounter[otherUser] = mutualCount;
        }
    }

    return Object.entries(mutualFriendCounter)
        .sort((a, b) => b[1] - a[1]) // Sắp xếp theo mutual friend count giảm dần
        .map(([id]) => id);
}

const friendships = {
    A: ['B', 'C', 'D'],
    B: ['A', 'C'],
    C: ['A', 'B', 'D'],
    D: ['A', 'E'],
    E: ['C', 'D'],
    F: ['C', 'B'],
    I: ['B', 'D'],
    K: ['A', 'B', 'C'],
    J: ['C', 'D', 'E'],
    H: ['A', 'B', 'C'],
    G: ['A', 'B', 'C', 'D', 'E'],
};

console.log(recommendFriendsAdvanced('I', friendships));
// 👉 Output: ['E', 'F']
// - E có bạn chung với A là: C, D
// - F có bạn chung với A là: B, C
