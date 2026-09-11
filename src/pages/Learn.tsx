import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  Search,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AppLink, PageHeading, SourceLinks } from '../components/shared';
import { processes, roasts, varieties } from '../data/agriculture';
import { knowledge, learningPaths, quiz } from '../data/knowledge';
import { useCoffee } from '../lib/context';

function PalateQuiz() {
  const { ui, l } = useCoffee();
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const question = quiz[index];
  return (
    <section className="palate-quiz">
      <div className="quiz-intro">
        <span className="eyebrow">{ui.quiz}</span>
        <h2>{l({ zh: '喝懂一杯，也读懂自己。', en: 'A little check. A clearer perspective.' })}</h2>
        <p>{ui.quizDescription}</p>
        <span className="quiz-flower" aria-hidden="true">
          ✳
        </span>
      </div>
      <div className="quiz-body">
        {question ? (
          <>
            <span className="micro">
              {String(index + 1).padStart(2, '0')} / {quiz.length.toString().padStart(2, '0')}
            </span>
            <h3>{l(question.question)}</h3>
            <div className="quiz-options">
              {question.options.map((option, optionIndex) => (
                <button
                  type="button"
                  key={option.en}
                  disabled={answer !== null}
                  className={
                    answer === null
                      ? ''
                      : optionIndex === question.answer
                        ? 'correct'
                        : optionIndex === answer
                          ? 'incorrect'
                          : ''
                  }
                  onClick={() => {
                    setAnswer(optionIndex);
                    if (optionIndex === question.answer) setScore((current) => current + 1);
                  }}
                >
                  <span>{String.fromCharCode(65 + optionIndex)}</span>
                  {l(option)}
                  {answer !== null && optionIndex === question.answer && <Check size={15} />}
                </button>
              ))}
            </div>
            {answer !== null && (
              <div className="quiz-feedback" role="status">
                <strong>{answer === question.answer ? ui.correct : ui.incorrect}</strong>
                <p>{l(question.explanation)}</p>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    setIndex(index + 1);
                    setAnswer(null);
                  }}
                >
                  {ui.nextQuestion}
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="quiz-finish">
            <CircleCheck size={34} />
            <strong>
              {score} / {quiz.length}
            </strong>
            <p>{ui.quizResult}</p>
            <button
              type="button"
              className="button button-dark"
              onClick={() => {
                setIndex(0);
                setAnswer(null);
                setScore(0);
              }}
            >
              {ui.restartQuiz}
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Learn() {
  const { ui, l, route, settings, setSetting, reducedMotion } = useCoffee();
  const params = new URLSearchParams(route.split('?')[1]);
  const articleId = params.get('article');
  const topic = params.get('topic');
  const itemId = params.get('item');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [material, setMaterial] = useState<'varieties' | 'processes' | 'roasts'>(
    topic === 'processes' || topic === 'roasts' ? topic : 'varieties',
  );
  const reader = useRef<HTMLElement>(null);
  const materialSection = useRef<HTMLElement>(null);
  const article = knowledge.find((entry) => entry.id === articleId) ?? knowledge[0];
  const filtered = knowledge.filter(
    (entry) =>
      (category === 'all' || category === entry.category) &&
      [entry.name.zh, entry.name.en, entry.summary.zh, entry.summary.en]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase().trim()),
  );
  useEffect(() => {
    if (articleId)
      reader.current?.scrollIntoView({
        block: 'start',
        behavior: reducedMotion ? 'instant' : 'smooth',
      });
  }, [articleId, reducedMotion]);
  useEffect(() => {
    if (topic === 'varieties' || topic === 'processes' || topic === 'roasts') {
      setMaterial(topic);
      materialSection.current?.scrollIntoView({
        block: 'start',
        behavior: reducedMotion ? 'instant' : 'smooth',
      });
    }
  }, [topic, reducedMotion]);
  if (!article) throw new Error('No knowledge data');
  const completed = settings.completed.includes(article.id);
  const materialItems =
    material === 'varieties' ? varieties : material === 'processes' ? processes : roasts;
  return (
    <div className="learn-page">
      <PageHeading
        eyebrow={ui.learnEyebrow}
        title={ui.learnTitle}
        description={ui.learnDescription}
      />
      <section className="learning-paths" aria-label={ui.paths}>
        {learningPaths.map((path, index) => {
          const done = path.lessons.filter((id) => settings.completed.includes(id)).length;
          return (
            <article className={`path-card path-${path.id}`} key={path.id}>
              <div className="path-top">
                <span className="micro">{index === 0 ? ui.beginner : ui.professional}</span>
                <span className="path-symbol" aria-hidden="true">
                  {index === 0 ? '✿' : '✧'}
                </span>
              </div>
              <h2>{l(path.name)}</h2>
              <p>{l(path.description)}</p>
              <div className="path-duration">
                <Clock3 size={12} />
                <span>{l(path.duration)}</span>
                <span>
                  {done} / {path.lessons.length} {ui.completed}
                </span>
              </div>
              <div className="path-progress">
                <span style={{ width: `${(done / path.lessons.length) * 100}%` }} />
              </div>
              <ol className="path-lessons">
                {path.lessons.map((id, lessonIndex) => {
                  const lesson = knowledge.find((k) => k.id === id);
                  return lesson ? (
                    <li key={id}>
                      <AppLink to={`/learn?article=${id}`}>
                        <span className={settings.completed.includes(id) ? 'done' : ''}>
                          {settings.completed.includes(id) ? (
                            <Check size={12} />
                          ) : (
                            String(lessonIndex + 1).padStart(2, '0')
                          )}
                        </span>
                        <div>
                          <strong>{l(lesson.name)}</strong>
                          <small>{l(path.exercises[lessonIndex] ?? lesson.practice)}</small>
                        </div>
                        <ArrowUpRight size={14} />
                      </AppLink>
                    </li>
                  ) : null;
                })}
              </ol>
            </article>
          );
        })}
      </section>
      <section
        className="section knowledge-section"
        ref={reader}
        aria-labelledby="knowledge-heading"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">{ui.reading}</span>
            <h2 id="knowledge-heading">
              {l({ zh: '从一个问题，走得更深。', en: 'Follow a question a little further.' })}
            </h2>
          </div>
          <div className="inline-search">
            <Search size={16} />
            <input
              type="search"
              aria-label={ui.knowledge}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={ui.knowledge}
            />
          </div>
        </div>
        <div className="knowledge-categories">
          {(['all', 'sensory', 'extraction', 'cupping', 'defects'] as const).map((key) => (
            <button
              type="button"
              key={key}
              aria-pressed={category === key}
              className={category === key ? 'chip active' : 'chip'}
              onClick={() => setCategory(key)}
            >
              {ui[key]}
            </button>
          ))}
        </div>
        <div className="knowledge-layout">
          <nav className="knowledge-index" aria-label={ui.reading}>
            {filtered.map((entry) => (
              <AppLink
                key={entry.id}
                to={`/learn?article=${entry.id}`}
                className={entry.id === article.id ? 'active' : ''}
                aria-current={entry.id === article.id ? 'page' : undefined}
              >
                <span>{l(entry.name)}</span>
                {settings.completed.includes(entry.id) ? (
                  <Check size={13} />
                ) : (
                  <ArrowUpRight size={13} />
                )}
              </AppLink>
            ))}
            {!filtered.length && <p className="empty-state">{ui.noResults}</p>}
          </nav>
          <article className="lesson-reader" data-testid="lesson-reader">
            <div className="lesson-meta">
              <span className="eyebrow">
                <BookOpen size={13} />
                {ui[article.category]}
              </span>
              {completed && (
                <span className="completed-badge">
                  <Check size={12} />
                  {ui.completed}
                </span>
              )}
            </div>
            <h2>{l(article.name)}</h2>
            <p className="lesson-summary">{l(article.summary)}</p>
            <p className="lesson-body">{l(article.body)}</p>
            <div className="practice-box">
              <span className="eyebrow">✳ {ui.practice}</span>
              <p>{l(article.practice)}</p>
            </div>
            <button
              type="button"
              className={completed ? 'button button-outline' : 'button button-dark'}
              onClick={() =>
                setSetting(
                  'completed',
                  completed
                    ? settings.completed.filter((id) => id !== article.id)
                    : [...settings.completed, article.id],
                )
              }
            >
              {completed ? <Check size={15} /> : <CircleCheck size={15} />}
              {completed ? ui.undoComplete : ui.markComplete}
            </button>
            <SourceLinks ids={article.sources} />
          </article>
        </div>
      </section>
      <section className="section materials-section" ref={materialSection}>
        <div className="section-heading">
          <div>
            <span className="eyebrow">{ui.exploreMaterials}</span>
            <h2>{l({ zh: '一颗豆子的不同可能。', en: 'The many possibilities of a seed.' })}</h2>
          </div>
        </div>
        <div className="material-tabs">
          {(['varieties', 'processes', 'roasts'] as const).map((key) => (
            <button
              type="button"
              key={key}
              className={material === key ? 'chip active' : 'chip'}
              aria-pressed={material === key}
              onClick={() => setMaterial(key)}
            >
              {ui[key]}
              <span>
                {key === 'varieties'
                  ? varieties.length
                  : key === 'processes'
                    ? processes.length
                    : roasts.length}
              </span>
            </button>
          ))}
        </div>
        <div className="materials-list">
          {materialItems.map((item, index) => (
            <details key={item.id} open={itemId === item.id}>
              <summary>
                <span className="micro">{String(index + 1).padStart(2, '0')}</span>
                <strong>{l(item.name)}</strong>
                {'species' in item && (
                  <small>{item.species === 'arabica' ? 'C. arabica' : 'C. canephora'}</small>
                )}
                <ChevronDown size={17} />
              </summary>
              <div className="material-body">
                <p>{l(item.description)}</p>
                {'effect' in item && <p>{l(item.effect)}</p>}
                {'tip' in item && <div className="info-strip">{l(item.tip)}</div>}
                {'sources' in item && <SourceLinks ids={item.sources} />}
              </div>
            </details>
          ))}
        </div>
      </section>
      <PalateQuiz />
    </div>
  );
}
