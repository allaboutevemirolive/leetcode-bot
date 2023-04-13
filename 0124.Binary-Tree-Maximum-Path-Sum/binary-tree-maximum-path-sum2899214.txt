// https://leetcode.com/problems/binary-tree-maximum-path-sum/solutions/2899214/rust-simple-recursive-0ms/
use std::rc::Rc;
use std::cell::RefCell;

type NodeOpt = Option<Rc<RefCell<TreeNode>>>;

impl Solution {
    pub fn max_path_sum(root: NodeOpt) -> i32 {
        let mut max = i32::MIN as i64;
        Solution::find_max(root, &mut max);
        max as i32
    }
    /// Returns the max sum that includes the given node, and updates the 
    /// overall max sum passed in.
    /// 
    fn find_max(node: NodeOpt, max: &mut i64) -> i64 {
        if let Some(node) = node {
            let node = node.borrow();
            let val  = node.val as i64;

            // Find the max sum for each child's single path.
            let left  = Solution::find_max(node.left.clone(), max);
            let right = Solution::find_max(node.right.clone(), max);

            // Max sum that includes one child and the current node, or only the
            // current node.
            let single = val.max(left.max(right) + val);

            // Max sum that includes the current node and both children, or 
            // only one child; whichever is greater.
            let both = single.max(left + right + val);

            // Update the overall max sum.
            *max = both.max(*max);

            // Return the max sum that includes one child.
            single
        } else {
            // Don't use 0, because that would allow a path to be chosen that
            // doesn't include any nodes if other nodes are all negative. Also,
            // using i64::MIN could cause underflow. So we use i32::MIN as i64.
            i32::MIN as i64
        }
    }
}