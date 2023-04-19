// https://leetcode.com/problems/largest-rectangle-in-histogram/solutions/187834/short-python-stack-solution-with-comments-98/
class Solution:
    
    def rectangles(self, values):
        heights = []
        for i, v in enumerate((*values, 0)):
            prev_pos = None
            
            # We going back to all prev bars, and cancel them since they're
            # higher that our current. Each we're doing, we need to check
            # rectangle which that from that bar and ending with current
            while heights and v <= heights[-1][1]:
                prev_pos, prev_h = heights.pop()
                yield (i - prev_pos) * prev_h
                                
            # At the end we add our bar to stack, but not with it's position
            # but with most left position that available
            heights.append((prev_pos if prev_pos is not None else i, v))

    def largestRectangleArea(self, heights):
        return max((x for x in self.rectangles(heights))) if heights else 0