// https://leetcode.com/problems/largest-rectangle-in-histogram/solutions/734976/python-rust-stack-solution/
class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        res, stack, heights = 0, [], [0] + heights + [0]
        
        for i, h in enumerate(heights):
            
            while stack and heights[stack[-1]] > h:
                j = stack.pop()
                res = max(res, (i - stack[-1] - 1) * heights[j])
                
            stack.append(i)
            
        return res