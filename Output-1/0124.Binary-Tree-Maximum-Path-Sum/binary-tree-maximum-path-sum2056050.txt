// https://leetcode.com/problems/binary-tree-maximum-path-sum/solutions/2056050/rust-post-order-traverse/
use std::rc::Rc;
use std::cell::RefCell;
impl Solution {
    pub fn max_path_sum(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        fn dfs(root: &Option<Rc<RefCell<TreeNode>>>, res: &mut i32) -> i32{
            match root{
                None => 0,
                Some(node) => {
                    let left = 0.max(dfs(&node.borrow().left, res));
                    let right = 0.max(dfs(&node.borrow().right, res));
                    *res = *res.max(&mut (left + right + node.borrow().val));
                    left.max(right) + node.borrow().val
                }
            }
        }
        let mut res = i32::MIN;
        dfs(&root, &mut res);
        res
    }
}