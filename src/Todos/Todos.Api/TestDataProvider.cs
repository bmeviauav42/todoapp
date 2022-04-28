using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Todos.Dal;

namespace Todos.Api
{
    public class TestDataProvider : BackgroundService
    {
        private readonly ITodosRepository todosRepository;
        private readonly ILogger<TestDataProvider> logger;

        public TestDataProvider(ITodosRepository todosRepository, ILogger<TestDataProvider> logger)
        {
            this.todosRepository = todosRepository;
            this.logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var retry = 10;
            while (--retry > 0)
            {
                try
                {
                    foreach (var testData in getTestData())
                        await ensureTestDataExist(testData);

                    logger.LogInformation("Seed data added.");
                    return;
                }
                catch (Elasticsearch.Net.ElasticsearchClientException)
                {
                    await Task.Delay(System.TimeSpan.FromSeconds(15));
                }
            }

            logger.LogError("Failed to add seed data.");
        }

        private async Task ensureTestDataExist(TodoItem itemToInsert)
        {
            var matches = await todosRepository.Search(itemToInsert.UserId, itemToInsert.Title);
            if (matches.Count != 0)
            {
                foreach (var existingItem in matches.Items)
                    if (existingItem.Title == itemToInsert.Title)
                        return;
            }

            await todosRepository.Insert(new CreateNewTodoRequest(itemToInsert.UserId, itemToInsert.Title, itemToInsert.Completed));
        }

        private IEnumerable<TodoItem> getTestData()
        {
            yield return new TodoItem(string.Empty, 1, "Lorem ipsum dolor sit amet, vel affert doming ad. Sed no vidisse theophrastus.", false);
            yield return new TodoItem(string.Empty, 1, "Habeo erroribus id usu, sea ea homero corpora. Vim intellegam temporibus ex, pro falli putent at.", false);
            yield return new TodoItem(string.Empty, 1, "Justo tollit volutpat id has, pri cu alia putant facilisi.", false);
            yield return new TodoItem(string.Empty, 1, "Lorem ipsum dolor sit amet.", false);
            yield return new TodoItem(string.Empty, 1, "Lorem ipsum dolor sit amet. Quo et eripuit constituto, qui at soluta latine tincidunt.", false);
            yield return new TodoItem(string.Empty, 1, "Id maluisset constituto inciderint eam.Ei pri nostro tamquam repudiandae, meliore maluisset inciderint pro ei.Ei reque nihil tacimates qui, ei pri modo inani deleniti.", false);
            yield return new TodoItem(string.Empty, 1, "Ad nostro omnesque electram sed, eum ex torquatos percipitur, aeterno principes deseruisse vis ne.", false);
            yield return new TodoItem(string.Empty, 2, "Postulant efficiantur ei vel, ad mea natum dolor mucius. ", false);
            yield return new TodoItem(string.Empty, 2, "Postulant efficiantur ei vel, ad mea natum dolor mucius. Ad nostro omnesque electram sed, eum ex torquatos percipitur, aeterno principes deseruisse vis ne.", false);
            yield return new TodoItem(string.Empty, 3, "Id maluisset constituto inciderint eam. Ei pri nostro tamquam repudiandae, meliore maluisset inciderint pro ei.Ei reque nihil tacimates qui, ei pri modo inani deleniti.", false);
        }
    }
}
