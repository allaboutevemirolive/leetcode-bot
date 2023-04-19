// https://leetcode.com/problems/binary-tree-maximum-path-sum/solutions/2901752/rust-16-lines-easy-to-understand-solution/
use std::cell::RefCell;
use std::rc::Rc;
type Tree = Option<Rc<RefCell<TreeNode>>>;
impl Solution {
    pub fn max_path_sum(mut root: Tree) -> i32 {
        fn into_max_subtree(root: &mut Tree) -> Option<i32> {
            let TreeNode { val, left, right } = &mut *root.as_mut()?.borrow_mut();
            let l = into_max_subtree(left).unwrap_or(0);
            let r = into_max_subtree(right).unwrap_or(0);
            *val += l.max(r).max(0);
            Some(*val)
        }
        fn f(root: &Tree) -> Option<i32> {
            let TreeNode { val, left, right } = &*root.as_ref()?.borrow();
            let r_sum = right.as_ref().map_or(0, |n| n.borrow().val);
            let l_sum = left.as_ref().map_or(0, |n| n.borrow().val);
            let l_rez = f(left).unwrap_or(i32::MIN);
            let r_rez = f(right).unwrap_or(i32::MIN);
            Some((*val + r_sum.min(l_sum).max(0)).max(l_rez).max(r_rez))
        }
        into_max_subtree(&mut root);
        f(&root).unwrap_or(0)
    }
}
