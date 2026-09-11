import { ArrowRight, ArrowUpRight, Check, Droplets, Scale, Thermometer, Timer } from 'lucide-react';
import { useState } from 'react';
import { AppLink, BrewGlyph, PageHeading, RangeField, SourceLinks } from '../components/shared';
import { processes, roasts } from '../data/agriculture';
import { families } from '../data/flavors';
import { methods } from '../data/methods';
import { origins } from '../data/origins';
import type { FamilyId, Method } from '../data/types';
import { useCoffee } from '../lib/context';
import {
  calculateRecipe,
  formatDuration,
  formatMass,
  type Preferences,
  recommend,
} from '../lib/core';

function RecipePanel({
  method,
  origin,
  roast,
  process,
}: {
  method: Method;
  origin?: string;
  roast?: string;
  process?: string;
}) {
  const { ui, l, settings, setDraftRecipe, go } = useCoffee();
  const [basis, setBasis] = useState<'coffee' | 'water'>('coffee');
  const [amount, setAmount] = useState(String(method.dose));
  const [ratio, setRatio] = useState(method.ratio);
  const [servings, setServings] = useState('1');
  let recipe: ReturnType<typeof calculateRecipe> | null = null;
  try {
    recipe = calculateRecipe({ amount: Number(amount), basis, ratio, servings: Number(servings) });
  } catch {
    /* Validation is displayed beside the inputs. */
  }
  const waterLabel = method.ratioBasis === 'yield' ? ui.yield : ui.water;
  return (
    <div className="brew-workbench">
      <div className={`brewer-story brewer-${method.id}`}>
        <div className="brewer-art">
          <span className="brewer-art-index">
            {String(methods.indexOf(method) + 1).padStart(2, '0')} / 10
          </span>
          <span className="brewer-art-star" aria-hidden="true">
            ✳
          </span>
          <div className="brewer-art-orbit" />
          <BrewGlyph method={method.id} />
          <span className="brewer-art-label">{l(method.name)}</span>
        </div>
        <div className="brewer-story-copy">
          <h2>{l(method.name)}</h2>
          <p>{l(method.description)}</p>
        </div>
        <div className="brew-specs">
          <div>
            <Thermometer size={16} />
            <span>{ui.temperature}</span>
            <strong>
              {method.temperature[0]}–{method.temperature[1]}
              <small>°C</small>
            </strong>
          </div>
          <div>
            <Timer size={16} />
            <span>{ui.time}</span>
            <strong>
              {formatDuration(method.seconds[0], settings.locale)}–
              {formatDuration(method.seconds[1], settings.locale)}
            </strong>
          </div>
        </div>
        <div className="grind-guide">
          <Scale size={16} />
          <div>
            <span>{ui.grind}</span>
            <p>{l(method.grind)}</p>
          </div>
        </div>
      </div>
      <div className="recipe-panel">
        <span className="eyebrow">
          <Droplets size={13} />
          {ui.calculator}
        </span>
        <h2>{ui.startingPoint}</h2>
        <div className="recipe-basis">
          <button
            type="button"
            className={basis === 'coffee' ? 'active' : ''}
            aria-pressed={basis === 'coffee'}
            onClick={() => {
              if (recipe) setAmount(String(Number(recipe.coffee.toFixed(2))));
              setBasis('coffee');
            }}
          >
            {ui.baseCoffee}
          </button>
          <button
            type="button"
            className={basis === 'water' ? 'active' : ''}
            aria-pressed={basis === 'water'}
            onClick={() => {
              if (recipe) setAmount(String(Number(recipe.water.toFixed(2))));
              setBasis('water');
            }}
          >
            {ui.baseWater}
          </button>
        </div>
        <div className="recipe-inputs">
          <label>
            {ui.perServing} · {basis === 'coffee' ? ui.coffee : waterLabel}
            <div className="unit-input">
              <input
                data-testid="recipe-amount"
                type="number"
                min="0.1"
                max={basis === 'coffee' ? '1000' : '10000'}
                step="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <span>g</span>
            </div>
          </label>
          <label>
            {ui.servings}
            <input
              data-testid="recipe-servings"
              type="number"
              min="1"
              max="20"
              step="1"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
            />
          </label>
        </div>
        <RangeField
          label={`${method.ratioBasis === 'yield' ? ui.yieldRatio : ui.ratioLabel} 1 :`}
          value={ratio}
          min={method.ratioRange[0]}
          max={method.ratioRange[1]}
          step={0.5}
          onChange={setRatio}
          low={`1:${method.ratioRange[0]}`}
          high={`1:${method.ratioRange[1]}`}
        />
        <div className="recipe-result" aria-live="polite" data-testid="recipe-result">
          <div>
            <span>
              {ui.total} · {ui.coffee}
            </span>
            <strong>
              {recipe ? formatMass(recipe.totalCoffee) : '—'}
              <small>g</small>
            </strong>
          </div>
          <span className="result-cross" aria-hidden="true">
            ×
          </span>
          <div>
            <span>
              {ui.total} · {waterLabel}
            </span>
            <strong>
              {recipe ? formatMass(recipe.totalWater) : '—'}
              <small>g</small>
            </strong>
          </div>
        </div>
        {!recipe && (
          <p className="form-error" role="alert">
            {ui.recipeError}
          </p>
        )}
        <p className="recipe-caveat">{l(method.caution)}</p>
        <button
          type="button"
          className="button button-dark full-width"
          disabled={!recipe}
          onClick={() => {
            if (recipe) {
              setDraftRecipe({
                method: method.id,
                dose: recipe.totalCoffee,
                water: recipe.totalWater,
                origin,
                roast,
                process,
              });
              go('/journal');
            }
          }}
        >
          {ui.addToJournal}
          <ArrowRight size={16} />
        </button>
        <SourceLinks ids={method.sources} />
      </div>
    </div>
  );
}

function Recommendations() {
  const { ui, l, go } = useCoffee();
  const [preferences, setPreferences] = useState<Preferences>({
    family: 'any',
    acidity: 3,
    body: 3,
    process: 'any',
    roast: 'medium',
  });
  const results = recommend(preferences);
  return (
    <section className="section recommendations">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{ui.recommendation}</span>
          <h2>{ui.recommendationDescription}</h2>
        </div>
        <span className="recommend-star" aria-hidden="true">
          ✳
        </span>
      </div>
      <div className="recommend-workspace">
        <div className="preference-panel">
          <label>
            {ui.family}
            <select
              value={preferences.family}
              onChange={(e) =>
                setPreferences({ ...preferences, family: e.target.value as FamilyId | 'any' })
              }
            >
              <option value="any">{ui.any}</option>
              {families.map((family) => (
                <option key={family.id} value={family.id}>
                  {l(family.name)}
                </option>
              ))}
            </select>
          </label>
          <RangeField
            label={ui.acidity}
            value={preferences.acidity}
            onChange={(acidity) => setPreferences({ ...preferences, acidity })}
            low={ui.low}
            high={ui.high}
          />
          <RangeField
            label={ui.body}
            value={preferences.body}
            onChange={(body) => setPreferences({ ...preferences, body })}
            low={ui.lightBody}
            high={ui.fullBody}
          />
          <div className="preference-selects">
            <label>
              {ui.process}
              <select
                value={preferences.process}
                onChange={(e) => setPreferences({ ...preferences, process: e.target.value })}
              >
                <option value="any">{ui.any}</option>
                {processes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {l(p.name)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {ui.roast}
              <select
                value={preferences.roast}
                onChange={(e) => setPreferences({ ...preferences, roast: e.target.value })}
              >
                {roasts.map((r) => (
                  <option key={r.id} value={r.id}>
                    {l(r.name)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="recommend-results" aria-live="polite">
          {results.map((result, index) => (
            <article className="recommend-card" key={result.origin.id}>
              <span className="recommend-number">0{index + 1}</span>
              <div>
                <AppLink to={`/origins?origin=${result.origin.id}`} className="recommend-title">
                  <h3>{l(result.origin.name)}</h3>
                  <ArrowUpRight size={17} />
                </AppLink>
                <p className="recommend-region">{l(result.origin.region)}</p>
                <div className="recommend-chips">
                  <AppLink to={`/learn?topic=processes&item=${result.process.id}`}>
                    {l(result.process.name)}
                  </AppLink>
                  <AppLink to={`/learn?topic=roasts&item=${result.roast.id}`}>
                    {l(result.roast.name)}
                  </AppLink>
                  <span>{l(result.method.name)}</span>
                </div>
                <ul>
                  {result.reasons.map((reason) => (
                    <li key={reason.en}>
                      <Check size={12} />
                      {l(reason)}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    go(
                      `/brew?method=${result.method.id}&origin=${result.origin.id}&roast=${result.roast.id}&process=${result.process.id}`,
                    );
                  }}
                >
                  {ui.tryRecipe}
                  <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
          {!results.length && (
            <div className="empty-state">
              <p>{ui.noResults}</p>
              <button
                type="button"
                className="button button-outline"
                onClick={() => setPreferences({ ...preferences, process: 'any' })}
              >
                {ui.clearFilters}
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="gentle-note">{ui.recommendCaveat}</p>
    </section>
  );
}

export default function Lab() {
  const { ui, l, route, go } = useCoffee();
  const params = new URLSearchParams(route.split('?')[1]);
  const method = methods.find((m) => m.id === params.get('method')) ?? methods[0];
  const origin = origins.find((o) => o.id === params.get('origin'));
  const roast = roasts.find((r) => r.id === params.get('roast'));
  const process = processes.find((p) => p.id === params.get('process'));
  if (!method) throw new Error('No methods');
  return (
    <div className="lab-page">
      <PageHeading eyebrow={ui.labEyebrow} title={ui.labTitle} description={ui.labDescription} />
      <nav className="method-rail" aria-label={ui.method}>
        {methods.map((item) => (
          <button
            type="button"
            key={item.id}
            className={method.id === item.id ? 'active' : ''}
            aria-pressed={method.id === item.id}
            onClick={() =>
              go(
                `/brew?method=${item.id}${origin ? `&origin=${origin.id}` : ''}${roast ? `&roast=${roast.id}` : ''}${process ? `&process=${process.id}` : ''}`,
                false,
              )
            }
          >
            <BrewGlyph method={item.id} />
            <span>{l(item.name)}</span>
          </button>
        ))}
      </nav>
      {(origin || roast || process) && (
        <div className="selected-bean">
          <span>{ui.origin}</span>
          {origin && (
            <AppLink to={`/origins?origin=${origin.id}`}>
              {l(origin.name)}
              <ArrowUpRight size={12} />
            </AppLink>
          )}
          {roast && (
            <span>
              {l(roast.name)} · {l(roast.tip)}
            </span>
          )}
          {process && <span>{l(process.name)}</span>}
        </div>
      )}
      <RecipePanel
        key={method.id}
        method={method}
        origin={origin?.id}
        roast={roast?.id}
        process={process?.id}
      />
      <section className="brew-instructions section">
        <div>
          <span className="eyebrow">{l(method.name)}</span>
          <h2>{ui.brewSteps}</h2>
          <ol className="brew-steps">
            {method.steps.map((step, index) => (
              <li key={step.en}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{l(step)}</p>
              </li>
            ))}
          </ol>
        </div>
        <aside className="troubleshoot-card">
          <span aria-hidden="true" className="troubleshoot-star">
            ✧
          </span>
          <h3>{ui.troubleshoot}</h3>
          <p>{l(method.tip)}</p>
          <AppLink to="/learn?article=sour-cup" className="text-link">
            {ui.defects}
            <ArrowUpRight size={15} />
          </AppLink>
          <div className="troubleshoot-topics">
            <AppLink to="/learn?article=water">
              {ui.water}
              <ArrowUpRight size={12} />
            </AppLink>
            <AppLink to="/learn?article=grind">
              {ui.grind}
              <ArrowUpRight size={12} />
            </AppLink>
            <AppLink to="/learn?article=temperature">
              {ui.temperature}
              <ArrowUpRight size={12} />
            </AppLink>
          </div>
        </aside>
      </section>
      <Recommendations />
    </div>
  );
}
