import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCommunityPostMock } from '@shared/api'
import logoUrl from '@shared/assets/logo.png'
import { createCommunityDetailPath, paths } from '@shared/config'
import { MENUS, Sidebar } from '@widgets/sidebar'

import * as S from './CommunityWritePage.styles'

const categories = ['자유게시판', '여행 후기', '경로/일정 공유'] as const

export function CommunityWritePage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [destination, setDestination] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('자유게시판')
  const [fileName, setFileName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim() || !destination.trim() || !content.trim()) {
      setErrorMessage('제목, 여행지, 내용을 모두 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')
      const post = await createCommunityPostMock({
        category,
        content: content.trim(),
        destination: destination.trim(),
        title: title.trim(),
      })
      navigate(createCommunityDetailPath(post.id), { replace: true })
    } catch {
      setErrorMessage('게시글을 등록하지 못했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <S.Page>
      <Sidebar logo={<S.Logo src={logoUrl} alt="PartTrip" />} menus={MENUS} />
      <S.Content>
        <S.Header>
          <div><h1>게시글 작성</h1><p>여행 경험과 궁금한 점을 공유해보세요.</p></div>
          <button type="button" onClick={() => navigate(paths.community)}>취소</button>
        </S.Header>
        <S.Form onSubmit={(event) => void handleSubmit(event)} noValidate>
          <S.Field>
            <span>게시판</span>
            <S.CategoryRow>{categories.map((item) => <button key={item} type="button" className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</S.CategoryRow>
          </S.Field>
          <S.Field><label htmlFor="community-title">제목</label><input id="community-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="제목을 입력하세요." maxLength={80} /></S.Field>
          <S.Field><label htmlFor="community-destination">여행지</label><input id="community-destination" value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="예: 교토, 일본" maxLength={40} /></S.Field>
          <S.Field><label htmlFor="community-content">내용</label><textarea id="community-content" value={content} onChange={(event) => setContent(event.target.value)} placeholder="여행 이야기를 자유롭게 작성하세요." maxLength={1200} /></S.Field>
          <S.UploadArea>
            <span>{fileName || '사진을 추가할 수 있습니다.'}</span>
            <label>사진 선택<input type="file" accept="image/*" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? '')} /></label>
          </S.UploadArea>
          {errorMessage ? <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage> : null}
          <S.Actions><button type="button" onClick={() => navigate(paths.community)}>취소</button><button type="submit" disabled={isSubmitting}>{isSubmitting ? '등록 중' : '게시글 등록'}</button></S.Actions>
        </S.Form>
      </S.Content>
    </S.Page>
  )
}
