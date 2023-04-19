// https://leetcode.com/problems/binary-tree-maximum-path-sum/solutions/1759083/rust/
    pub fn max_path_sum(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        fn helper(root: &Option<Rc<RefCell<TreeNode>>>) -> (i32, i32) {
            match root {
                None => (i32::MIN, i32::MIN),
                Some(node) => {
                    let (left_sum, left_max) = helper(&node.borrow().left);
                    let (right_sum, right_max) = helper(&node.borrow().right);
                    let value = &node.borrow().val;

                    let mut max_including_node = *value;

                    if left_sum != i32::MIN {
                        max_including_node = max_including_node.max(left_sum + value);
                    }
                    if right_sum != i32::MIN {
                        max_including_node = max_including_node.max(right_sum + value);
                    }

                    let mut max_overall = left_max.max(right_max);
                    max_overall = max_overall.max(max_including_node);

                    if left_sum != i32::MIN && right_sum != i32::MIN {
                        max_overall = max_overall.max(left_sum + right_sum + value);
                    }

                    (max_including_node, max_overall)
                }
            }
        }

        helper(&root).1
    }