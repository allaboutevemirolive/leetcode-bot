// https://leetcode.com/problems/binary-tree-maximum-path-sum/solutions/2899227/another-simple-dfs-solution-rust/
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
use std::cmp;
impl Solution {
    pub fn max_path_sum(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        let mut res = i32::MIN;
        Self::dfs(&root, &mut res);
        res
    }
    fn dfs(root: &Option<Rc<RefCell<TreeNode>>>, res: &mut i32) -> i32 {
        if let Some(node) = root {
            let node = node.borrow();
            let left = cmp::max(Self::dfs(&node.left, res), 0);
            let right = cmp::max(Self::dfs(&node.right, res), 0);
            *res = cmp::max(*res, left + right + node.val);
            return node.val + cmp::max(left, right);
        }
        0
    }
}