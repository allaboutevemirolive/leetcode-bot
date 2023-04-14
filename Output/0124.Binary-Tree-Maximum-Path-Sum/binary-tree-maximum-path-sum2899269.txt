// https://leetcode.com/problems/binary-tree-maximum-path-sum/solutions/2899269/rust-elixir-return-2-values-in-sub-function/
use std::rc::Rc;
use std::cell::RefCell;

type OptNode = Option<Rc<RefCell<TreeNode>>>;

impl Solution {
    pub fn max_path_sum(root: OptNode) -> i32 {
        Self::max_sum(&root).0
    }

    fn max_sum(node: &OptNode) -> (i32, i32) {
        match node.as_ref() {
            None => (i32::MIN, i32::MIN),
            Some(n) => {
                let b = n.borrow();
                let (l1, l2) = Self::max_sum(&b.left);
                let (r1, r2) = Self::max_sum(&b.right);
                let ans = l1.max(r1).max(b.val + 0.max(l2) + 0.max(r2));
                let ans2 = b.val + 0.max(l2).max(r2);
                (ans, ans2)
            }
        }
    }
}