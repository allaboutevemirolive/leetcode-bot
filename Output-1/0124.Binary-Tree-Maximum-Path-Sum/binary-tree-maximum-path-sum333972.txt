// https://leetcode.com/problems/binary-tree-maximum-path-sum/solutions/333972/easy-to-understand-rust-solution/
/// For every nodes, we should consider two types of path:
/// 1. Left children to right children
/// 2. Parent to children(left or right)
///
/// For example
/// Input: [-10,9,20,null,null,15,7]
///
///    -10
///    / \
///   9  20 <-- input node
///     /  \
///    15   7
///
/// Get paths of above two types:
/// 1. 15 - 20 - 7
/// 2. -10 - 20 - 15 (15 > 7)
///
/// We name first type disconnected (disconnected to parent),
/// and the other connected (connected to parent).

use std::rc::Rc;
use std::cell::RefCell;
impl Solution {
    pub fn max_path_sum(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        if let Some(root) = root {
            let (disconnected, connected) = max_child(root);
            return disconnected.max(connected);
        }

        0
    }
}

fn max_child(root: Rc<RefCell<TreeNode>>) -> (i32, i32) {
    if root.borrow().left.is_none() && root.borrow().right.is_none() {
        return (root.borrow().val, root.borrow().val);
    }

    // storage the max disconnected path sum.
    // Also consider negative nodes like [-2, -1, -3]. It just save the max value.
    let mut max_disconnected: i32 = std::i32::MIN;
    let mut left_connected: i32 = 0;
    let mut right_connected: i32 = 0;
    if let Some(node) = root.borrow().left.as_ref() {
        let (disconnected, connected) = max_child(node.clone());
        // For disconnected path, just pick max, because it's completion of computed
        max_disconnected = max_disconnected.max(disconnected);
        // For connected path, we only use non-negative children.
        left_connected = connected.max(0);
    }

    if let Some(node) = root.borrow().right.as_ref() {
        let (disconnected, connected) = max_child(node.clone());
        max_disconnected = max_disconnected.max(disconnected);
        right_connected = connected.max(0);
    }

    let result = (
        // Calculate disconnected path
        max_disconnected.max(left_connected + right_connected + root.borrow().val),
        // Calculate connected path
        left_connected.max(right_connected) + root.borrow().val
    );

    result
}