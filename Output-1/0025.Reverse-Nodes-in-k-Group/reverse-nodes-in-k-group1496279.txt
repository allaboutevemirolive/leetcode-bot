// https://leetcode.com/problems/reverse-nodes-in-k-group/solutions/1496279/rust-0ms-o-1-space-iterative-solution/
pub fn reverse_k_group(head: Option<Box<ListNode>>, k: i32) -> Option<Box<ListNode>> {
    // iterate over a linked list by repeatedly popping first node
    let pop_iter = |node: Option<Box<ListNode>>| (0..)
        .scan(node, |head, _| {
            let mut pop = head.take();
            *head = pop.as_deref_mut().and_then(|pop| pop.next.take());
            pop
        })
        .fuse();

    let (mut nodes, mut result, k) = (pop_iter(head), None, k as usize);
    let mut cur = &mut result;
    loop {
        let mut count = 0;
        // reverse `k`-length slice of list
        let group = nodes.by_ref().take(k)
            .inspect(|_| count += 1)
            .fold(None, |prev, mut node| {
                node.next = prev;
                Some(node)
            });
        if count == k {
            // append reversed slice and move to end of `result`
            *cur = group;
            while cur.is_some() {
                cur = &mut cur.as_deref_mut().unwrap().next;
            }
        } else {
            // we've reached the end, append un-reversed slice
            *cur = pop_iter(group).fold(None, |prev, mut node| {
                node.next = prev;
                Some(node)
            });
            break result;
        }
    }
}