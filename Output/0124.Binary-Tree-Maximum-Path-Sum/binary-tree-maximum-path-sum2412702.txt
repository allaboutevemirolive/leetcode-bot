// https://leetcode.com/problems/binary-tree-maximum-path-sum/solutions/2412702/rust-readable-dfs-solution-with-comments/
use std::cell::RefCell;
use std::rc::Rc;

// TreeNode as defined by LeetCode
#[derive(Debug, PartialEq, Eq)]
pub struct TreeNode {
    pub val: i32,
    pub left: Option<Rc<RefCell<TreeNode>>>,
    pub right: Option<Rc<RefCell<TreeNode>>>,
}

impl TreeNode {
    #[inline]
    pub fn new(val: i32) -> Self {
        TreeNode {
            val,
            left: None,
            right: None,
        }
    }
}


pub fn max_path_sum(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
    let mut answer = 0;

    if let Some(root) = root.as_ref() {
        answer = root.borrow().val;
        dfs(root, &mut answer);
    }

    answer
}

fn dfs(root: &Rc<RefCell<TreeNode>>, answer: &mut i32) -> i32 {
    let root_ref = root.borrow();
    let mut left_path = root_ref.val;
    let mut right_path = root_ref.val;

    if let Some(node) = root_ref.left.as_ref() {
        let val = dfs(node, answer);

        // Check if the left sub-tree increases the sum
        // If it does - then include it in the sum, otherwise
        // let the sum be just the current node
        if left_path + val > left_path {
            left_path = left_path + val;
        }
    }

    if let Some(node) = root_ref.right.as_ref() {
        let val = dfs(node, answer);

        // Check if the right sub-tree increases the sum
        // If it does - then include it in the sum, otherwise
        // let the sum be just the current node
        if right_path + val > right_path {
            right_path = right_path + val;
        }
    }

    // The answer is either
    // * the left sub-tree path,
    // * the right sub-tree path
    // * the sum of the left & right sub-tree paths (note
    //   that the current node is included twice, so we
    //   have to subtract it)
    // * the old maximum path sum
    *answer = (*answer)
        .max(left_path)
        .max(right_path)
        .max(left_path + right_path - root_ref.val);

    // We can return only the left or the right sub-tree paths
    // in order to form a new path with the parent node
    left_path.max(right_path)
}