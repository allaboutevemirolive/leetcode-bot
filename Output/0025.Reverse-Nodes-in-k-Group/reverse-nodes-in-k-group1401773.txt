// https://leetcode.com/problems/reverse-nodes-in-k-group/solutions/1401773/rust-simple-and-readable-solution-using-o-k-additional-space/
impl Solution {
    pub fn reverse_k_group(head: Option<Box<ListNode>>, k: i32) -> Option<Box<ListNode>> {
        let mut stack = Vec::with_capacity(k as usize);
        let mut src = head;
        let mut head = ListNode::new(0);
        let mut tail = &mut head.next;

        while let Some(mut node) = src.take() {
            src = node.next.take();

            stack.push(node);
            if stack.len() == k as usize {
                while let Some(node) = stack.pop() {
                    *tail = Some(node);
                    tail = &mut tail.as_mut().unwrap().next;
                }
            }
        }

        for node in stack {
            *tail = Some(node);
            tail = &mut tail.as_mut().unwrap().next;
        }

        head.next.take()
    }
}