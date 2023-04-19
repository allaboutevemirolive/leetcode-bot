// https://leetcode.com/problems/binary-tree-maximum-path-sum/solutions/2952151/rust-dfs-easy-to-understand/
// Definition for a binary tree node.
// #[derive(Debug, PartialEq, Eq)]
// pub struct TreeNode {
//   pub val: i32,
//   pub left: Option<Rc<RefCell<TreeNode>>>,
//   pub right: Option<Rc<RefCell<TreeNode>>>,
// }
// 
// impl TreeNode {
//   #[inline]
//   pub fn new(val: i32) -> Self {
//     TreeNode {
//       val,
//       left: None,
//       right: None
//     }
//   }
// }
use std::rc::Rc;
use std::cell::RefCell;
impl Solution {
    pub fn max_path_sum(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        fn dfs(root: &Option<Rc<RefCell<TreeNode>>>, max_path: &mut i32) -> i32{
            match root {
                Some(node) => {
                    let left_gain = std::cmp::max(dfs(&node.borrow().left, max_path), 0);
                    let right_gain = std::cmp::max(dfs(&node.borrow().right, max_path), 0);
                    let curr_max_path = node.borrow().val + left_gain + right_gain;
                    *max_path = std::cmp::max(curr_max_path, *max_path);

                    return node.borrow().val + std::cmp::max(left_gain, right_gain);
                },
                None => 0
            }
        }

        let mut max_path = i32::MIN;
        dfs(&root, &mut max_path);
        max_path
    }
}