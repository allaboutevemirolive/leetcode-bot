// https://leetcode.com/problems/binary-tree-maximum-path-sum/solutions/229561/simple-rust-solution/
use std::rc::Rc;
use std::cell::RefCell;
fn max(a: i32, b:i32) -> i32{
    if a>b{
        a
    } else {
        b
    }
}
impl Solution {
    pub fn do_work(root: &Option<Rc<RefCell<TreeNode>>>) -> (i32, i32) {
        match root {
            None => (-0x7ffffff, 0),
            Some(now_pt) => {
                let now = now_pt.borrow();
                let (ls, ll) = Solution::do_work(&now.left);
                let (rs, rl) = Solution::do_work(&now.right);
                let cs = max(ls, rs);
                let cs = max(max(max(now.val, ll + rl + now.val), max(ll + now.val, rl + now.val)), cs);
                let cl = max(max(ll, rl), 0) + now.val;
                (cs, cl)
            }
        }
    }
    pub fn max_path_sum(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        let (ans, _) = Solution::do_work(&root);
        ans
    }
}