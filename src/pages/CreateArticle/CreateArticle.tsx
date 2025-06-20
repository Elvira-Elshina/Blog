import React, { useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../hooks/customHooks'
import { notification } from 'antd'

import { createArticle, updateArticle } from '../../services/fetchData'
import { fetchArticle } from '../../store/blogAppSlice'
import { ErrorIndicator } from '../../components/ErrorIndicator/ErrorIndicator'
import styles from './CreateArticle.module.scss'

interface FormData {
  title: string
  description: string
  body: string
  tags: { tag: string }[]
}

export const CreateArticle: React.FC = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const { slug } = useParams<{ slug: string }>()
  
  const error = useAppSelector((state) => state.articleSliceReducer.error)
  const currentArticle = useAppSelector((state) => state.articleSliceReducer.currentArticle)
  const isLoading = useAppSelector((state) => state.articleSliceReducer.isLoading)

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    control,
    reset,
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
      body: '',
      tags: [{ tag: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  })

  useEffect(() => {
    if (slug) {
      dispatch(fetchArticle(slug))
    }
  }, [slug, dispatch])

  useEffect(() => {
    if (currentArticle && slug) {
      reset({
        title: currentArticle.title || '',
        description: currentArticle.description || '',
        body: currentArticle.body || '',
        tags: currentArticle.tagList?.length > 0 
          ? currentArticle.tagList.map((tag: string) => ({ tag }))
          : [{ tag: '' }],
      })
    }
  }, [currentArticle, slug, reset])

  const onSubmit = (data: FormData) => {
    const tags = data.tags
      .map((tag) => tag.tag.trim())
      .filter((tag) => tag.length > 0)

    const articleData = {
      title: data.title,
      description: data.description,
      body: data.body,
      tagList: tags,
    }

    if (!slug) {
      dispatch(createArticle(articleData))
        .unwrap()
        .then(() => {
          notification.success({
            message: 'Статья создана!',
          })
          history.push('/')
        })
        .catch((error) => {
          notification.error({
            message: error.message || 'Ошибка при создании статьи',
          })
        })
    } else {
      dispatch(updateArticle({ articleData, slug }))
        .unwrap()
        .then(() => {
          notification.success({
            message: 'Статья обновлена!',
          })
          history.push('/')
        })
        .catch((error) => {
          notification.error({
            message: error.message || 'Ошибка при обновлении статьи',
          })
        })
    }
  }

  const pageTitle = slug ? 'Edit article' : 'Create new article'

  if (error) {
    return <ErrorIndicator error={error} />
  }

  return (
    <div className={styles.create}>
      <form className={styles.create__form} onSubmit={handleSubmit(onSubmit)}>
        <h4 className={styles.create__form_header}>{pageTitle}</h4>

        <span className={styles.create__form_label}>Title</span>
          <input
            placeholder="Title"
            className={styles.create__form_input}
            {...register('title', {
              required: 'Заголовок обязателен для заполнения',
            })}
          />
        <div className={styles.create__error}>
          {errors?.title && <p>{errors.title.message}</p>}
        </div>

        <span className={styles.create__form_label}>Short description</span>
          <input
            placeholder="Description"
            className={styles.create__form_input}
            {...register('description', {
              required: 'Краткое описание обязательно для заполнения',
            })}
          />
        <div className={styles.create__error}>
          {errors?.description && <p>{errors.description.message}</p>}
        </div>

        <span className={styles.create__form_label}>Text</span>
          <textarea
            placeholder="Text"
            className={styles.create__form_textarea}
            {...register('body', {
              required: 'Текст обязателен для заполнения',
            })}
          />
        <div className={styles.create__error}>
          {errors?.body && <p>{errors.body.message}</p>}
        </div>

        <span className={styles.create__form_label}>Tags</span>
        {fields.map((field, index) => (
          <div key={field.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <input
              placeholder="Tag"
              className={styles.create__form_input__tag}
              {...register(`tags.${index}.tag`)}
            />
            {index > 0 && (
              <button
                type="button"
                className={styles.create__delete_button}
                onClick={() => remove(index)}
              >
                Delete
              </button>
            )}
            {index === fields.length - 1 && (
              <button
                type="button"
                className={styles.create__add_button}
                onClick={() => append({ tag: '' })}
              >
                Add tag
              </button>
            )}
          </div>
        ))}

        <button 
          className={styles.create__form_button} 
          disabled={!isValid || isLoading}
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default CreateArticle