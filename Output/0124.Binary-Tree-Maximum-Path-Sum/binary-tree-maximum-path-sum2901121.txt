// https://leetcode.com/problems/binary-tree-maximum-path-sum/solutions/2901121/rust-ultra-easy-solution-dfs/
use std::rc::Rc;
use std::cell::RefCell;

impl Solution {
    pub fn max_path_sum(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        let mut max_sum = i32::MIN;
        Solution::max_gain(&mut max_sum, root);
        max_sum
    }

    fn max_gain(max_sum: &mut i32, node: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        match node {
            None => 0,
            Some(val) => {
                let v = val.as_ref().borrow();

                let l = std::cmp::max(Solution::max_gain(max_sum, v.left.clone()), 0);
                let r = std::cmp::max(Solution::max_gain(max_sum, v.right.clone()), 0);

                let n = v.val + l + r;
                *max_sum = std::cmp::max(*max_sum, n);

                v.val + std::cmp::max(l, r)
            }
        }
    }
}