// 빠른 테스트: Supabase 연결 및 portfolio 데이터 조회
const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xvepcoyoqjvezdrbnvfp.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZXBjb3lvcWp2ZXpkcmJudmZwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDA0NzU4OCwiZXhwIjoyMDc5NjIzNTg4fQ.s13L9-KijFQb7f2gGTdzejbPFmsVi4Auimeq9qmD7qE';

console.log('Supabase URL:', url);
console.log('Connecting...');

const supabase = createClient(url, serviceRoleKey);

(async () => {
  try {
    // 1. portfolio 테이블 조회
    console.log('\n--- Testing portfolio table ---');
    const { data: portfolioData, error: portfolioError } = await supabase
      .from('portfolio')
      .select('*')
      .eq('id', 'vibe-coding')
      .single();

    if (portfolioError) {
      console.error('Portfolio query error:', portfolioError);
    } else {
      console.log('✓ Portfolio data retrieved:');
      if (portfolioData && portfolioData.data) {
        const data = portfolioData.data;
        console.log('  Profile name:', data.profile?.name);
        console.log('  Projects count:', data.projects?.length || 0);
        console.log('  Experiences count:', data.experiences?.length || 0);
        console.log('  Skills groups count:', data.skills?.length || 0);
      }
    }

    // 2. guestbook 테이블 조회
    console.log('\n--- Testing guestbook table ---');
    const { data: guestbookData, error: guestbookError, count } = await supabase
      .from('guestbook')
      .select('*', { count: 'exact' })
      .limit(1);

    if (guestbookError) {
      console.error('Guestbook query error:', guestbookError);
    } else {
      console.log(`✓ Guestbook has ${count} entries`);
      if (guestbookData && guestbookData.length > 0) {
        console.log('  Latest entry:', guestbookData[0].name, '-', guestbookData[0].message.substring(0, 30));
      }
    }

    // 3. vote_items 테이블 조회
    console.log('\n--- Testing vote_items table ---');
    const { data: votesData, error: votesError } = await supabase
      .from('vote_items')
      .select('*');

    if (votesError) {
      console.error('Vote items query error:', votesError);
    } else {
      console.log('✓ Vote items:');
      votesData.forEach((item) => {
        console.log(`  ${item.id}: ${item.count} likes`);
      });
    }

    // 4. recommendations 테이블 조회
    console.log('\n--- Testing recommendations table ---');
    const { data: recsData, error: recsError, count: recsCount } = await supabase
      .from('recommendations')
      .select('*', { count: 'exact' });

    if (recsError) {
      console.error('Recommendations query error:', recsError);
    } else {
      console.log(`✓ Recommendations count: ${recsCount}`);
      if (recsData && recsData.length > 0) {
        console.log('  Sample:', recsData[0].title);
      }
    }

    console.log('\n✅ All tests completed successfully!');
  } catch (err) {
    console.error('Test error:', err);
  }
})();
