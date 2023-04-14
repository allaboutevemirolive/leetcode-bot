// https://leetcode.com/problems/binary-tree-maximum-path-sum/solutions/603556/python-rust-clean-solution-and-video-explanation/
use std::rc::Rc;
use std::cell::RefCell;
impl Solution {
    pub fn max_path_sum(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        let (_, max) = Solution::dfs(&root);
        return max;
    }
    
    fn dfs(node: &Option<Rc<RefCell<TreeNode>>>) -> (i32, i32) {
        if let Some(n) = node {
            let (leftBranch, maxLeft) = Solution::dfs(&n.borrow().left);
            let (rightBranch, maxRight) = Solution::dfs(&n.borrow().right);
            let val = n.borrow().val;
            
            let mut maxBranch = leftBranch.max(rightBranch);    
            maxBranch = val.max(val + maxBranch);
            let maxFromThisPoint = maxBranch.max(leftBranch + rightBranch + val);
            let max = maxFromThisPoint.max(maxLeft).max(maxRight);
            
            return (maxBranch, max);
        }
        
        return (-100000, -100000);
    }
}