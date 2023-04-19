// https://leetcode.com/problems/binary-tree-maximum-path-sum/solutions/233497/cleanest-rust-solution/
use std::cmp::max;
use std::rc::Rc;
use std::cell::RefCell;
use std::cell::Cell;
use std::collections::VecDeque;

impl Solution {
    pub fn max_path_sum(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        let mtp = Rc::from(Cell::from(std::i32::MIN));
        Solution::sub_tree_sum(root.unwrap().clone(),  mtp.clone());
        mtp.get()
    }

    fn sub_tree_sum(node: Rc<RefCell<TreeNode>>, mtp : Rc<Cell<i32>>) -> i32 {
        let val = node.borrow().val;
        let mut left_sum = 0;
        let mut right_sum = 0;
        
        //consider left tree
        if let Some(n) = &node.borrow().left {
            left_sum = max(0, Solution::sub_tree_sum(n.clone(), mtp.clone()));
        };

        //consider right tree
        if let Some(n) = &node.borrow().right {
            right_sum = max(0, Solution::sub_tree_sum(n.clone(), mtp.clone()));
        };

        mtp.set(max(mtp.get(), left_sum + right_sum + val));

        max(left_sum, right_sum) + val
    }
}