// https://leetcode.com/problems/binary-tree-maximum-path-sum/solutions/2517686/rust-recursive-post-order-traversal/
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
        let mut res = i32::MIN;
        let mut left = 0;
        let mut right = 0;
        let cur = root.as_ref().unwrap().borrow().val;

        // postorder_traversal
        if let Some(node) = root.as_ref().unwrap().borrow().left.clone() {
            res = res.max(Solution::max_path_sum(Some(node.clone())));
            left = node.borrow().val;
        }
        if let Some(node) = root.as_ref().unwrap().borrow().right.clone() {
            res = res.max(Solution::max_path_sum(Some(node.clone())));
            right = node.borrow().val;
        }

        res = res
            .max(cur)
            .max(cur+left)
            .max(cur+right)
            .max(
                cur+left+right
            );
        
        root.as_ref().unwrap().borrow_mut().val = cur + 0.max(left).max(right);

        res
    }
}