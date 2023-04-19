// https://leetcode.com/problems/reverse-nodes-in-k-group/solutions/2969229/rust-o-n-o-1-solution-0ms-beats-100-no-dummy-heads-no-recursion/
impl Solution {
    pub fn reverse_k_group(mut head: Option<Box<ListNode>>, k: i32) -> Option<Box<ListNode>> {
        let mut result = None;
        let mut result_tail = &mut result;
        let (mut g_head, mut g_count) = (None, 0);

        while let Some(mut node) = head {
            // Take node.next and move it to head. node.next is None now
            head = node.next.take();
            if g_count % k == 0 {
                // Replace group head with node (we start new group).
                // At the same time prev group head will go through pattern matching expression
                if let Some(group) = g_head.replace(node) {
                    // Link group to the end of the result
                    result_tail.insert(group);
                    // Advance result_tail to the end of the group
                    while let Some(node) = result_tail {
                        result_tail = &mut node.next;
                    }
                }
            }
            else {
                // Put node to the head of the group
                // This reverses node order
                g_head.insert(node).next = g_head.take();
            }
            g_count += 1;
        }
        if g_count % k != 0 {
            // Reverse nodes of the last group if its length less than k
            let mut tail_head = g_head.take();
            while let Some(mut node) = tail_head {
                tail_head = node.next.take();
                g_head.insert(node).next = g_head.take();
            }
        }
        if let Some(tail) = g_head {
            // Link last group to the end of the result
            result_tail.insert(tail);
        }

        result
    }
}