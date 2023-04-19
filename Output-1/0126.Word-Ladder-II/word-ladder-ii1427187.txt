// https://leetcode.com/problems/word-ladder-ii/solutions/1427187/python-bi-directional-bfs-with-backtracking/
from collections import defaultdict, deque
class Solution:
    def findLadders(self, beginWord, endWord, wordList):
        wordList = set(wordList)
        queue = deque([[beginWord]])
        maskmap = self.masking(wordList)
        seen = {beginWord}
        stop = False
        
        while queue:
            # record the new visited words and union with seen at the end of the cycle,
            # since there can be multiple paths that use the same word at the same step
            visited = set()
            for _ in range(len(queue)):
                cur = queue.popleft()
                last = cur[-1]
                for i in range(len(last)):
                    mask = last[:i] + '_' + last[i+1:]
                    neighbors = maskmap[mask]
                    for neighbor in neighbors:
                        if neighbor not in seen:
                            queue.append(cur + [neighbor])
                            visited.add(neighbor)
                            if neighbor == endWord:
                                stop = True
            seen |= visited
                            
            if stop:
                return [arr for arr in queue if arr[-1] == endWord]
        
        return []
        
        
    @staticmethod
    def masking(wordList):
        maskmap = defaultdict(list)
        for word in wordList:
            for i in range(len(word)):
                mask = word[:i] + '_' + word[i+1:]
                maskmap[mask] += [word]
        return maskmap