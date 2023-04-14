// https://leetcode.com/problems/reverse-nodes-in-k-group/solutions/1828444/rust-0ms-100-use-iterators-to-group-and-reverse-nodes/
pub fn reverse_k_group(head: Option<Box<ListNode>>, k: i32) -> Option<Box<ListNode>> {
    let mut head = head;

    // 1) Add linked list nodes to a vector
    // Note: We want a vector of Option's, so we can call take() ... this is pivotal,
    // so we can later take ownership of nodes away from the mutable iterator.
    let mut nodes: Vec<Option<Box<ListNode>>> = Vec::new();
    while let Some(mut node) = head.take() {
        head = node.next.take();
        nodes.push(Some(node));
    }

    let mut dummy_head = Some(Box::new(ListNode::new(-123)));
    let mut curr = &mut dummy_head;

    // 2) chunk up the vector, and reassemble the reversed chunks into a linked list
    for chunk in nodes.chunks_mut(k as usize) {
        // rev() decorates the iterator, and changes the type signature, so
        // collect() so they both return a Vec.
        let nodes: Vec<&mut Option<Box<ListNode>>> = if chunk.len() == k as usize {
            chunk.iter_mut().rev().collect()
        } else {
            chunk.iter_mut().collect()
        };

        // for-loop here -- instead of .for_each -- because we cannot assign `curr` in a closure
        for node in nodes {
            curr.as_mut().unwrap().next = node.take();
            curr = &mut curr.as_mut().unwrap().next;
        }
    }

    dummy_head.unwrap().next
}